const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.route('/')
    .get((req,res)=>{
        fs.readdir('./DataLogs',(err,files)=>{
            const namesWithoutExt = files.map(file => path.parse(file).name);
            res.render('home',{ items: namesWithoutExt});
        })
    })
    .post((req,res)=>{
        const now = new Date();

        const minute = String(now.getMinutes()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const yyyy = now.getFullYear();
        const dte = `${minute}-${hour}-${dd}-${mm}-${yyyy}`;

        fs.writeFile(`DataLogs/${dte}.txt`,req.body.text,(err)=>{});

        fs.readdir('./DataLogs',(err,files)=>{
            const namesWithoutExt = files.map(file => path.parse(file).name);
            res.render('home',{ items: namesWithoutExt});
        })
    })

app.route('/update/:dte')
    .get((req,res)=>{
        const filePath = path.join(__dirname, 'DataLogs', `${req.params.dte}.txt`);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if(err) return res.send('Error reading file');
            res.render('update', { fileContent: data, dtte: req.params.dte });
        });
    })
    .post((req,res)=>{
        fs.writeFile(`DataLogs/${req.params.dte}.txt`,req.body.text,(err)=>{});
        res.render("update",{ fileContent: req.body.text, dtte: req.params.dte });
    });

app.route('/view/:dte')
    .get((req,res)=>{
        const filePath = path.join(__dirname, 'DataLogs', `${req.params.dte}.txt`);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.send('Error reading file');
            }
            res.render('view', { fileContent: data, dtte: req.params.dte });
        });
    });

app.route('/create')
    .get((req,res)=>{
        res.render('create')
    });

app.route('/delete/:dte')
    .get((req,res)=>{
        fs.unlink(`./DataLogs/${req.params.dte}.txt`,(err)=>{})
        res.redirect('/');
    })

app.use((err,req,res,next)=>{
    res.status(500).send(err.message);
})

app.listen(4040);
