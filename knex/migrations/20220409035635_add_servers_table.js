/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("servers").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("servers", function (table) {
        table.string("server_id", 255).notNullable().primary();
        table.string("server_name", 255).notNullable();
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("servers");
};
