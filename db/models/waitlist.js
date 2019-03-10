const insertOne = {
  sql: function(email, receiveUpdates) {
    return `
      INSERT INTO waitlist (
        email,
        receive_updates
      ) VALUES (
        '${email}',
        ${receiveUpdates}
      ) RETURNING *`;
  },
  postQuery: function(result) {
    return result.rows[0];
  }
};

module.exports = {
  insertOne
};
