 
// Initialize Firebase
var config = {
apiKey: "AIzaSyAgt1Et8O3eCPh0Xxk0h4snV4FV6y2Kgsg",
authDomain: "registro-8123c.firebaseapp.com",
databaseURL: "https://registro-8123c.firebaseio.com",
projectId: "registro-8123c",
storageBucket: "registro-8123c.appspot.com",
messagingSenderId: "970600101125"
};
firebase.initializeApp(config); 

// Crear inicio de sesión
var auth = firebase.auth();

var db = firebase.firestore();

var fire = new Vue({    
    data:{

    },
    methods:{
        state(collback){
            auth.onAuthStateChanged(function(user){
                collback(user);
            })
        },
        register(data){
            return auth.createUserWithEmailAndPassword(data.email, data.password);
        },
        login(data){
            return auth.signInWithEmailAndPassword(data.email, data.password);
        },
        logout(){
            auth.signOut();
        }
    }
})