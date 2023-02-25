const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Spellchecked, {
        foreignKey: 'userId',
      })
    }
  }
  User.init(
    {
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
      },
      lastlogin: {
        type: DataTypes.DATE,
      },
      email_verif_token: {
        type: DataTypes.STRING,
      },
      reset_pwd_token: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'User',
      indexes: [
        {
          fields: ['reset_pwd_token'],
          name: 'IX_reset_pwd_token',
        },
      ],
    }
  )
  return User
}
