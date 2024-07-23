/* APIROUTE */

//IMPORTS
const model = require('./model');
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');

//cors
var cors = require('cors');
var corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200
}
router.use(cors())

//WORDS

//Word info
//Get words list in a page (names)
router.get('/words/names', async (req, res) => {

    try {
        const wordCount = await model.Word.count();
        const words = await model.Word.findAll({
            order: [['name', 'ASC']],
            attributes: ['name']
        });
        const data = {
            names: words.map(word => word.name),
            count: wordCount
        }
        res.json(data);
    } catch (error) {
        res.status(500).send('Error retrieving word list', error);
    }
});

//Get array of words relative to the array of given names
router.post('/words/data', async (req, res) => {
    const list = req.body.names || [];

    try {
        const words = await model.Word.findAll({
          where: {
            name: {
              [Sequelize.Op.in]: list,
            },
          },
        });
        const data = {
            data: words
        }
        res.json(data);
    } catch (error) {
        res.status(500).send('Error retrieving words list', error);
    }
});

//Is there a silamena translation
router.get('/words/english_exists/:word', async (req, res) => {
    const word = req.params.word.toLowerCase().replace('_', " ");
    await model.Word.findOne({
        where: {
            english: {
                [Sequelize.Op.or]: [
                    {[Sequelize.Op.eq]: word},
                    {[Sequelize.Op.startsWith]: `${word}, %`},
                    {[Sequelize.Op.endsWith]: `%, ${word}`},
                    {[Sequelize.Op.like]: `%, ${word}, %`},
                    {[Sequelize.Op.startsWith]: `${word}/%`},
                    {[Sequelize.Op.endsWith]: `%/${word}`},
                    {[Sequelize.Op.like]: `%/${word}/%`},
                    {[Sequelize.Op.like]: `%, ${word}/%`},
                    {[Sequelize.Op.like]: `%/${word}, %`},
                ]
            }
        }
    }).then((row) => {
        if(row) {
            res.json({exists:true})
        } else {
            res.json({exists:false})
        }
    });
});
//Get words list in a page (names, roles and english)
router.get('/words/all-english', async (req, res) => {
    try {
        const words = await model.Word.findAll({ attributes: ['name', 'english', 'role'] });
        res.json(words);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching words');
    }
});

//Get all the silamena words given an english one
router.get('/words/from-english/:inputWord', async (req, res) => {
    const inputWord = req.params.inputWord.toLowerCase().replaceAll("_", " ");

    try {
        const silamenaWords = await model.Word.findAll({
            
            where: {
                english: {
                    [Sequelize.Op.or]: [
                        {[Sequelize.Op.eq]: inputWord},
                        {[Sequelize.Op.startsWith]: `${inputWord}, %`},
                        {[Sequelize.Op.endsWith]: `%, ${inputWord}`},
                        {[Sequelize.Op.like]: `%, ${inputWord}, %`},
                        {[Sequelize.Op.startsWith]: `${inputWord}/%`},
                        {[Sequelize.Op.endsWith]: `%/${inputWord}`},
                        {[Sequelize.Op.like]: `%/${inputWord}/%`},
                        {[Sequelize.Op.like]: `%, ${inputWord}/%`},
                        {[Sequelize.Op.like]: `%/${inputWord}, %`},
                    ]
                }
            },
        });
        const data = {
            data: silamenaWords
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error retrieving silamena words');
    }
});

//Get all the silamena words given etymology
router.get('/words/from-etymology/:inputWord', async (req, res) => {
    const inputWord = req.params.inputWord.toLowerCase().replaceAll("_", " ");

    try {
        const silamenaWords = await model.Word.findAll({
            where: {
                etymology: {
                    [Sequelize.Op.or]: [
                        {[Sequelize.Op.eq]: inputWord},
                        {[Sequelize.Op.startsWith]: `${inputWord} %`},
                        {[Sequelize.Op.endsWith]: `% ${inputWord}`},
                        {[Sequelize.Op.like]: `% ${inputWord} %`},
                    ]
                }
            },
        });
        const data = {
            data: silamenaWords
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error retrieving silamena words');
    }
});

//Get all the silamena words given tag (#tag)
router.get('/words/from-tag/:inputWord', async (req, res) => {
    const inputWord = req.params.inputWord.toLowerCase().replaceAll("_", " ");

    try {
        const silamenaWords = await model.Word.findAll({
            where: {
                description: {
                    [Sequelize.Op.or]: [
                        {[Sequelize.Op.like]: `%#${inputWord}#%`},
                    ]
                }
            },
        });
        const data = {
            data: silamenaWords
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error retrieving silamena words');
    }
});

//Create word
router.post('/words/new', (req, res) => {
    if(req.body.name) {
        let tempword = model.newWord();
        tempword.name = req.body.name.toLowerCase();
        tempword.role = req.body.role;
        tempword.english = req.body.english.toLowerCase();
        tempword.etymology = req.body.etymology;
        tempword.description = req.body.description;
        tempword.synonyms = req.body.synonyms;
        model.dbaddWord(tempword);
        const jsonContent = JSON.stringify(tempword);
        res.status(201).end(jsonContent);
    } else {
        res.status(400).send("The name is missing");
    }
});

//Delete word
router.delete('/words/:name', (req, res) => {
    const param = req.params.name.toLowerCase();
    
    model.Word.findOne({ where: { name: param } }).then(word => {
        if (!word) {
            return res.status(404).send('Word not found');
        } else {
            word.destroy();
            res.status(204).send('Word deleted successfully');
        }
    }).then(() => {}).catch(error => {
        res.status(500).send('Error deleting word:', error);
    });    
});

//Update/Edit word
router.put('/words/:name',  (req, res) => {
    console.log(req.body)
    const param = req.params.name.toLowerCase();
    console.log(param)

    model.Word.findOne({ where: { name: param } }).then(word => {
        if (!word) {
            return res.status(404).send('Word not found');
        }
        word.role = req.body.role;
        word.english = req.body.english;
        word.etymology = req.body.etymology;
        word.description = req.body.description;
        word.synonyms = req.body.synonyms;
        return word.save();
    }).then(() => {
        res.status(202).send('Word updated successfully');
    }).catch(error => {
        res.status(500).send('Error updating word', error);
    });
});

// EXAMPLES MANAHGER

//Get requests manager
//Get random example
router.get('/examples/random', async (req, res) => {
    const num = req.query.num || 1;
    try {
        const examples = await model.Example.findAll();
        if (examples.length > 0) {
            let result = examples.slice().sort(() => Math.random() - 0.5).slice(0, num);
            let data = {
                examples: result
            }
            res.json(data);
        } else {
            res.status(404).send('No examples found');
        }
    } catch(error) {
        res.status(500).send("Error retrieving the expressions:", error);
    }
});

//Retrieves all examples
router.get('/examples/all', async (req, res) => {
    try {
        const examplesCount = await model.Example.count();
        const examplesData = await model.Example.findAll();
        const data = {
            examples: examplesData,
            count: examplesCount
        }
        res.json(data);
    } catch (error) {
        res.status(500).send('Error retrieving examples list', error);
    }
});

//Finds 3 expression
router.get('/examples/:expression', async (req, res) => {
    const expr = req.params.expression.toLowerCase().replace("_", " ");
    const num = req.query.num || 3;
    try {
        const expressions = await model.Example.findAll({
            where: {
                silamena: {
                    [Sequelize.Op.or]: [
                        {[Sequelize.Op.eq]: expr},
                        {[Sequelize.Op.startsWith]: `${expr} %`},
                        {[Sequelize.Op.endsWith]: `% ${expr}`},
                        {[Sequelize.Op.like]: `% ${expr} %`},
                    ]
                }
            },
        });
    
        let result = expressions.slice().sort(() => Math.random() - 0.5).slice(0, num);
        let data = {
            examples: result
        }
        res.json(data);
    } catch(error) {
        res.status(500).send("Error retrieving the expressions:", error);
    }
});

//Create example
router.post('/examples/new', (req, res) => {
    let tempex = model.newExample();

    tempex.silamena = req.body.silamena;
    tempex.english = req.body.english;

    model.dbaddExample(tempex);
    
    const jsonContent = JSON.stringify(tempex);
    res.status(201).end(jsonContent);
});

//Delete example
router.delete('/examples/:id', (req, res) => {
    const param = req.params.id;
    
    model.Example.findOne({ where: { id: param } }).then(example => {
        if (!example) {
            return res.status(404).send('Example not found');
        } else {
            example.destroy();
            res.status(204).send('Example deleted successfully');
        }
    }).then(() => {}).catch(error => {
        res.status(500).send('Error deleting example', error);
    });    
});

//Update/Edit example
router.put('/examples/:id',  (req, res) => {
    const param = req.params.id;

    model.Example.findOne({ where: { id: param } }).then(example => {
        if (!example) {
            return res.status(404).send('Example not found');
        }
        example.silamena = req.body.silamena;
        example.english = req.body.english;

        return example.save();
    }).then(() => {
        res.status(202).send('Example updated successfully');
    }).catch(error => {
        res.status(500).send('Error updating word', error);
    });
});

router.get('*', (req, res) => {
    res.status(400).send("Nope, this request doesn't exist");
});

//EXPORTS ROUTES
module.exports = router;