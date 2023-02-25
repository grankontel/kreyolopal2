'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn(
        'Users', // table name
        'reset_pwd_token', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
      queryInterface.addIndex('Users', {
        fields: ['reset_pwd_token'],
        name: 'IX_reset_pwd_token',
      }),
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeIndex('Users', 'IX_reset_pwd_token'),
      queryInterface.removeColumn('Users', 'reset_pwd_token'),
    ])
  },
}
