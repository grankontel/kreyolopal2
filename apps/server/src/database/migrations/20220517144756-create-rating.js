'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ratings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      spellcheckedId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Spellcheckeds',
          key: 'id',
          as: 'spellcheckedId',
        },
      },
      rating: {
        type: Sequelize.INTEGER,
      },
      user_correction: {
        type: Sequelize.STRING,
      },
      user_notes: {
        type: Sequelize.STRING,
      },
      admin_correction: {
        type: Sequelize.STRING,
      },
      admin_notes: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Ratings')
  },
}
