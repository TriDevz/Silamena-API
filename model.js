/* MODEL */

const sqlite3 = require('sqlite3').verbose();

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://koyeb-adm:pb6kIcx4YUAa@ep-misty-wave-a25miukz.eu-central-1.pg.koyeb.app/koyebdb', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, // This will enforce SSL
      rejectUnauthorized: false // You might need this to avoid SSL certificate validation errors
    }
  }
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

function Init() {
    try {
        Word.init(
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    primaryKey: true
                },
                role: DataTypes.INTEGER,
                english: DataTypes.STRING,
                etymology: DataTypes.STRING,
                description: DataTypes.TEXT,
                synonyms: DataTypes.STRING,
            },
            {
                sequelize,
                modelName: 'Word'
            }
        );
        Example.init(
            {
                silamena: DataTypes.TEXT,
                english: DataTypes.TEXT
            },
            {
                sequelize,
                modelName: 'Example'
            }
        );
        console.log(`Word/Example initialized`);
    } catch (error) {
        console.error("Error:", error);
    }
    
}

class Word extends Sequelize.Model {}
class Example extends Sequelize.Model {}
Init();

//DATABASE
//connection to db
async function dbconnect() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

//creates table if it doesn't exist
Word.sync().then(() => {
    console.log("Words table created successfully!");
}).catch(error => {
    console.error("Error creating Words table:", error);
});
Example.sync().then(() => {
    console.log("Examples table created successfully!");
}).catch(error => {
    console.error("Error creating Example table:", error);
})

async function newWord() {
    try {
        const wordModel = await Word.build( {});
        console.log(`new word created`);
        return wordModel;
    } catch (error) {
        console.error("Error:", error);
    }
}
async function newExample() {
    try {
        const exampledModel = await Example.build( {});
        console.log(`new example created`);
        return exampledModel;
    } catch (error) {
        console.error("Error:", error);
    }
}

async function dbaddWord(wordmetemp) {
    try {
        const wordModel = await Word.build( {
            name: wordmetemp.name,
            role: wordmetemp.role,
            english: wordmetemp.english,
            etymology: wordmetemp.etymology,
            description: wordmetemp.description,
            synonyms: wordmetemp.synonyms,
        });
        wordModel.save();
        console.log(`Word added`);
    } catch (error) {
        console.error("Error:", error);
    }
}
async function dbaddExample(extemp) {
    try {
        const exModel = await Example.build( {
            silamena: extemp.silamena,
            english: extemp.english
        });
        exModel.save();
        console.log(`Example added`);
    } catch (error) {
        console.error("Error:", error);
    }
}

module.exports = { Word, Example, newWord, newExample, dbconnect, Init, dbaddWord, dbaddExample };