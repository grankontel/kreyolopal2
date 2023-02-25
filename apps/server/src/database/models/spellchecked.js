const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Spellchecked extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spellchecked.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      })
      Spellchecked.hasMany(models.Rating, {
        foreignKey: 'spellcheckedId',
      })
    }
  }
  Spellchecked.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      kreyol: {
        type: DataTypes.ENUM('GP', 'MQ'),
        allowNull: false,
      },
      request: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
      },
      response: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: 'Spellchecked',
    }
  )
  return Spellchecked
}
