const insertOne = {
  sql: function(name) {
    return `
      INSERT INTO roadmap_feature (
        name
      ) VALUES (
        ${name}
      ) RETURNING *`;
  },
  postQuery: function(result) {
    return result.rows[0];
  }
};

const upvote = {
  sql: function(id) {
    return `
      UPDATE roadmap_feature
      SET votes = votes + 1
      WHERE id = ${id}`;
  },
  postQuery: function(result) {
    return result;
  }
};

const getAll = {
  sql: function() {
    return `
      SELECT * FROM roadmap_feature`;
  },
  postQuery: function(result) {
    return result.rows;
  }
};

module.exports = {
  insertOne,
  upvote,
  getAll
};
