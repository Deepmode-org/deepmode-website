/*
  Takes all models and the client and returns a simple interface to query from
*/

module.exports = function(client, models) {
  var queryInterface = {};
  // models should be an object w/ key names as model name, and props as model modules
  Object.entries(models).forEach(([modelName, module]) => {
    queryInterface[modelName] = {};
    Object.entries(module).forEach(([methodName, method]) => {
      if (!Array.isArray(method)) {
        // Convert to waterfall format for a single query
        method = [method];
      }
      queryInterface[modelName][methodName] = function() {
        return (async function (queryWaterfall, input) {
          let result = input;
          for (let entry of queryWaterfall) {
            if (Array.isArray(result)) {
              // Allow for multiple arguments
              result = await client.query(entry.sql(...result));
            } else if (typeof result === "object" && result !== null) {
              // Note the assumption of consistent object ordering
              // this should be guaranteed by ES6/7 but could result in strange bugs
              result = await client.query(entry.sql(...Object.values(result)));
            } else {
              result = await client.query(entry.sql(result));
            }
            result = entry.postQuery(result);
          }
          return result;
        })(method, [...arguments]);
      };
    });
  });
  return queryInterface;
};
