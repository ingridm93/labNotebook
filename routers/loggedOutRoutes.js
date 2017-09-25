const path = require('path');
const dbHashing = require('../database/hashing');
const dbStudent = require('../database/student');


var loggedOutRoutes = (app) => {



    app.get('/', (req, res) => {
        return res.sendFile( path.join( __dirname, '../index.html' ) );
    });


    app.post('/api/student/register', (req, res) => {
        console.log('student server post');
        const {first_name, last_name, email, password, course} = req.body;


        if(first_name && last_name && email && password && course) {

            console.log("success")
            console.log(first_name, last_name);

            dbHashing.hashPassword(password)
            .then((hash) => {

                return dbHashing.addStudent(first_name, last_name, email, hash)

                .then((result) => {

                    const {id, first_name, last_name, email, role} = result.rows[0]

                    req.session.user = {
                        id: id,
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        role: role
                    }

                    dbStudent.makeCourse(id, course);

                    res.json({
                        success: true
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({
                        success: false
                    })
                })

            })
            .catch((err) => {
                console.log(err);
            })

        }
    });


    app.post('/api/teacher/register', (req, res) => {
        console.log('teacher server post');

        const {first_name, last_name, email, password} = req.body;

        //unless we make two different app.post depending on if teacher or student

        if(first_name && last_name && email && password) {

            dbHashing.hashPassword(password)
            .then((hash) => {
                console.log('adding user to DB', hash);
                return dbHashing.addTeacher(first_name, last_name, email, hash)
                .then((result) => {
                        console.log('teacher', result);

                        const {id, first_name, last_name, email, role} = result.rows[0]

                        req.session.user = {
                            id: id,
                            first_name: first_name,
                            last_name: last_name,
                            email: email,
                            role: role
                        }

                    res.json({
                        success: true
                    });
                })
                .catch((err) => {
                    console.log(err.stack);
                })

            })
            .catch((err) => {
                console.log(err.stack);
            })

        }
    })

    app.post('/api/login', (req, res) => {
        const{email, password} = req.body;

        dbHashing.getUserByEmail(email)
        .then((result) => {
            dbHashing.checkPassword(password, result.rows[0].password)
            .then((doesMatch) => {
                if(!doesMatch) {
                    throw 'Password is incorrect.'
                    alert('Your email or password are incorrect')
                } else {

                    console.log('password is correct', result.rows);

                    const {id, first_name, last_name, email, role} = result.rows[0];

                    req.session.user = {
                        id, first_name, last_name, email, role
                    }

                    res.json({
                        success: true,
                        role: role
                    });

                    if(role === 'student') {
                        res.redirect('/api/student');
                    } else {
                        res.redirect('/api/teacher');
                    }
                }

            }).catch((err) => {
                console.log(err);
            })
        }).catch((err) => {
            console.log(err);
        })
    })
};

//should put app.get with restrictions for req.session.user to not access the teacher side and vice versa.




module.exports = loggedOutRoutes;
