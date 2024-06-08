module.exports = (sequelize, DataTypes) => {
    const CumulativeQuestion = sequelize.define('CumulativeQuestion', {
        cumulative_question_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        topic_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Topics',
                key: 'topic_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        question_description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        no_of_marks_allocated: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        difficulty_level: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        option_1: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        option_2: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        option_3: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        option_4: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        correct_option: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 4
            }
        }
    }, {
        timestamps: true // Enabling timestamps for tracking purposes
    });

    CumulativeQuestion.associate = (models) => {
        CumulativeQuestion.belongsTo(models.Topic, {
            foreignKey: 'topic_id',
            as: 'topic'
        });
    };

    return CumulativeQuestion;  
};
