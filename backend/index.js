
const express=require('express');
require('dotenv').config();
const app=express();
const morgan=require('morgan');
const cors=require('cors');
const Person=require('./models/person');




app.use(express.static('build'));
app.use(express.json());

const persons=[
    {
      "name": "Arto Hellas",
      "id": 1,
      "number": "42-456-8888"
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
      "name": "Nefertiti",
      "number": "000-555-0005",
      "id": 5
    },
    {
      "name": "Pikachu",
      "number": "1994-750-1235",
      "id": 6
    }
]

app.use(morgan('dev'));
morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.res(req, res, 'body').length, 'bytes'
  ].join(' ')
})
/*morgan(':method :url :status :res[content-length] - :response-time ms');

morgan.token('host', function(req, res) {
  return req.hostname;
});

/*app.use(morgan(':method :host :status :param[id] :res[content-length] - :response-time ms'));

morgan.token('param', function(req, res, param) {
  return req.params[param];
});*/




morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));


app.use(cors());


app.get('/api/persons',(req,res)=>{
    Person.find({}).then(result=>{
      console.log(result);
        res.json(result)
    }
    ).catch(error =>{
      console.log('no hay nada',error)
    })
});

app.get('/api/persons/:id',(req,res)=>{
    Person.findById(req.params.id).then(result=>{
        if(result){
            res.json(result)
        }else{
            res.status(404).end()
        }
    }
    )
}
);

app.delete('/api/persons/:id',(req,res)=>{
    Person.findByIdAndRemove(req.params.id).then(result=>{
      if(result){
        res.status(204).end()
      }else{
        res.status(404).end()
      }
    }
    )
   
});

app.post('/api/persons',(req,res)=>{
    const body=req.body;
    if(!body.name || !body.number){
        return res.status(400).json({error:'name or number missing'});
    }
    const person= new Person({
        name:body.name,
        number:body.number,
        id:Math.floor(Math.random()*100000)
    })
    person.save().then(result=>{
        res.json(result)
    }).catch(error=>{
        console.log(error)
    }
    )
});

app.get('/info',(req,res)=>{
    const date=new Date();
    const info={
        persons:persons,
        date:date,
        count:persons.length
        }
        res.send(`<h1>Phonebook has info fo ${info.count} people</h1> <br> <h2>${info.date}</h2>`);
    
     } )


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT=process.env.PORT;
app.listen(PORT)
console.log(`Server running at http://localhost ${PORT}`);

