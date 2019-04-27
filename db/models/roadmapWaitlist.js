const insertOne = {
  sql: function(email, featureID) {
    return `
      INSERT INTO roadmap_waitlist (
        email,
        feature
      ) VALUES (
        '${email}',
        ${featureID}
      ) RETURNING *`;
  },
  postQuery: function(result) {
    return result.rows[0];
  }
};

module.exports = {
  insertOne
};
