const txtLoginEmail = document.getElementById('loginEmail');
const txtLoginPassword = document.getElementById('loginPass');

const txtCreateName = document.getElementById('createName');
const txtCreateEmail = document.getElementById('createEmail');
const txtCreatePassword = document.getElementById('createPass');

function createAccount() {

    const name = txtCreateName.value;
    const email = txtCreateEmail.value;
    const pass = txtCreatePassword.value;
    const auth = firebase.auth();
    
    //signup
    let regEmail = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-z0-9-]+(\.[a-z0-9]+)*(\.[a-z]{2,})$/;
    if (regEmail.exec(email)) {
        if (pass.length < 6) {
            alert("Enter at least 6 characters");
        }

        else {

            const promise = auth.createUserWithEmailAndPassword(email, pass);
            promise.then(result => {
                var uid = database.child("users").push().key;
                var obj = {
                    email: email,
                    id: uid,
                    name: name,
                    pass: pass
                }
                database.child("/users/" + uid).set(obj);
            });
            promise.then(f => {
                window.location.href = "login.html";
            });
            promise.catch(e => {
                console.log(e.message);
            });
        }
    }
    else {
        console.log("Invalid Email");
    }

}

//Login 

function loginAccount() {
    const logemail = txtLoginEmail.value;
    const logpass = txtLoginPassword.value;
    const logauth = firebase.auth();
    const logpromise = logauth.signInWithEmailAndPassword(logemail, logpass);
    logpromise.then(e => {
        window.location.href = "home.html";
        // localStorage.setItem("pollemail",logemail);
    })
    logpromise.catch(e => {
        console.log(e.message);
        alert(e.message);
    });
}

const database = firebase.database()

//ADDTODO
function addTodo() {
    var val = document.getElementById("val").value;
    var to = {
        todo: val
    };
    database.ref(`todoApp`).child("Value").push(to);
    document.getElementById("val").value = "";
}

function myTodo() {
    var alldat = [];
    
    var list = document.getElementById("todolist");
    database.ref("todoApp").child("Value").on('child_added', (data) => {


        var obj = data.val();
        obj.id = data.key
        alldat.push(obj);
        localStorage.setItem('todo', JSON.stringify(obj));
    
        for (var i = 0; i < alldat.length; i++) {
            var text = document.createTextNode(alldat[i].todo);
            var rt = alldat[i].id;

        }
        console.log(rt);
        // console.log("yaha error he");
        var list = document.getElementById("todolist");
        var li = document.createElement("li");
        // li.setAttribute("id",ind)
        var te = document.createElement("i");
        te.id = rt;
        var btn = document.createElement("button");
        var btn1 = document.createElement("button");
        var btnText = document.createTextNode("");
        var btnText1 = document.createTextNode("");
       
        btn1.appendChild(btnText1);
        btn.appendChild(btnText);
       
        btn.className += "glyphicon glyphicon-trash butt";
        btn1.className += "glyphicon glyphicon-edit butt";
        
        btn.onclick = function () {
            database.ref("todoApp/Value").child(rt).remove();
            var li = this.parentNode;
            var ul = li.parentNode;
            ul.removeChild(li);


        }
       
        btn1.onclick = function () {
            var x = prompt("enter text");
            var te = this.parentNode;
            te.innerHTML = x;
            te.appendChild(btn);
            te.appendChild(btn1);
            
        }
        te.appendChild(text);
        te.appendChild(btn);
        te.appendChild(btn1)
        li.appendChild(te);
        list.appendChild(li);
        val.value = "";

    })
}

function delet() {

    alert("Are you sure to delete");
    var list = document.getElementById("todolist").innerHTML = "";
    database.ref("todoApp").remove();

}
