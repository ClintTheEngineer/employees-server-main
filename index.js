const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const PORTS = process.env.PORTS || 5000;

app.use(cors());
app.use(express.json());


app.post("/employees", async(req, res) => {
    try {
      const { firstName, lastName, jobTitle, dateOfHire, salary, email, id} = req.body;
      const newEmployee = await pool.query("INSERT INTO corp_data (first_name, last_name, job_title, date_of_hire, salary, e_mail, id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [firstName, lastName, jobTitle, dateOfHire, salary, email, id]
      );
      res.json(newEmployee.rows[0])
    } catch(err){
        console.error(err.message)
    }
});

app.get('/', (req, res) => {
    res.send("Hello World")
})

 

app.get('/employees', async (req, res) => {
    try {
        const allEmployees = await pool.query("SELECT * FROM corp_data");
        res.json(allEmployees.rows)
    } catch (err){
        console.error(err.message)
    }
}) 


app.get('/employees/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const employee = await pool.query("SELECT * FROM corp_data WHERE id = $1", [id]);

        res.json(employee.rows)
    } catch (err){
        console.error(err.message)
    }
})

app.get('/search/', async (req, res) => {
    const searchTerm = req.query.term;
    const client = await pool.connect();
    const result = await client.query(`
       SELECT * FROM corp_data WHERE last_name LIKE '%${searchTerm}%' ORDER BY last_name ASC;
    `);
    client.release();
    res.send(result.rows);
 });

app.put('/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, jobTitle, dateOfHire, salary, email } = req.body;
        const updateEmployee = await pool.query("UPDATE corp_data SET first_name = $1, last_name = $2, job_title = $3, date_of_hire = $4, salary = $5, e_mail = $6 WHERE id = $7", 
        [firstName, lastName, jobTitle, dateOfHire, salary, email, id]
     );

     res.json("Employee successfully updated!")
    } catch (err) {
        console.error(err.message);
    }
})

app.delete("/employees/:id", async(req, res) => {
    try {
      const { id } = req.params;
      const deleteEmployee = await pool.query("DELETE FROM corp_data WHERE id = $1", 
      [id]
      );
      res.json("Employee successfully deleted!")
    } catch  (err) {
        console.log(err.message)
    }
});




app.listen(PORTS, () => {
    console.log(`Server is live on port 5000`)
});
