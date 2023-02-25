const thistime = new Date()

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          firstname: 'Thierry',
          lastname: 'Malo',
          email: 'thierry@egzanp.com',
          // password: 'admin6',
          password:
            '$argon2i$v=19$m=4096,t=3,p=1$JDapNqYLL61+BJr0Ptfwow$jC6nxCQcrZgOxQA2L24CXOgmxrJPbnXfG0gWsfnXCso',
          createdAt: thistime,
          updatedAt: thistime,
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {})
  },
}
