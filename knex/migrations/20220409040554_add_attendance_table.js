/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.hasTable("attendance").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("attendance", function (table) {
        table.increments();
        table.string("user_id", 255).notNullable();
        table.string("user_name", 255).notNullable();
        table.string("from", 255).notNullable();
        table.string("until", 255).notNullable();
        table.decimal("total", 5, 0).notNullable();
        table.string("reason", 255).notNullable();
        table.string("server_id", 255).notNullable();
        table.foreign("server_id").references("servers.server_id");
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("attendance");
};
