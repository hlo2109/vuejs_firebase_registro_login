new Vue({
    el:".divlogin",
    data:{    
        load:false,    
        sesion:false,
        listUser:[],
        form:{
            type:0, // 0 = Login , 1 = Registro 2- Recuperar contraseña
            email:"",
            password:"", 
            passwordos:""}
    },
    created(){ 
        var tis = this;
        fire.state(function(data){
            if(!data){
                console.log("Falta inciar sesión");
            } else{
                tis.sesion = true;
                db.collection('users').onSnapshot(function(snap){
                    tis.listUser = [];
                    snap.forEach(user => {
                        console.log(user.data());
                        tis.listUser.push(user.data());
                    });
                })

                swal("Bienvenido!","","success");
            }
             tis.load=true;
        })
    },
    methods:{
        sendForm(){
            var tis = this;
            if(this.validaType()){
                console.log(this.form);
                if(this.form.type==0){
                    fire.login(this.form).then(function(userData){
                        console.log(userData);
                    }).catch(function(error){
                        swal("Error!",error.message,"error");
                    })
                }
                // Inicia registro
                if(this.form.type==1){
                    fire.register(this.form).then(function(userData){
                        console.log(userData);
                        var user={
                            email:tis.form.email,
                            id:userData.user.uid
                        };
                        db.collection('users').doc(userData.user.uid).set(user).then(function(){
                            console.log("Colección guardada.");
                        })
                    }).catch(function(error){
                        swal("Error!",error.message,"error");
                    })
                }
            }
        },
        validaType(){
            if(this.form.type==0 && !this.validaEmail && !this.validaPassword){
                return true;
            }
            else if(this.form.type==1 && !this.validaEmail && !this.validaRepetirPassword){
                return true;
            }
            else if(this.form.type==2 && !this.validaEmail){
                return true;
            }
            return false;
        },
        logout(){
            fire.logout();
            this.sesion = false;
        },
        editCamp(item){
            swal({
                text:'Nombre:',
                content:"input",
                button:{
                    text:"Editar",
                    closemodal:false
                }
            }).then(name=>{
                if(!name){ swal(":(","El nombre es requerido","error"); return false; }
                var data = { name:name };
                db.collection('users').doc(item.id).update(data).then(function(data){
                    swal("Correcto!","Dato editado","success");
                })

            })
        },
        deleteUser(item){
            swal({
                title:"Seguro que desea continuar",
                text:"Esta acción es irreversible",
                icon:"warning",
                buttons:true,
                dargeMode:true
            })
            .then((ok) => {
                if(ok){
                    db.collection("users").doc(item.id).delete().then(function(data){
                        swal("Correcto!","Dato eliminado","success");
                    })
                }
            })
        }
    },
    computed:{
        validaEmail(){
            var exp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if(exp.test(this.form.email)){
                return false;
            } else{
                return true;
            }
        },
        validaPassword(){
            var exp = /^(?=.*\d)(?=.*[a-záéíóúüñ]).*[A-ZÁÉÍÓÚÜÑ]/;
            if(exp.test(this.form.password)){
                return false;
            } else{
                return true;
            }
        },
        validaRepetirPassword(){
            if(this.form.password==this.form.passwordos){
                return false;
            } else{
                return true;
            }
        },
        title(){
            return (this.form.type==0)?'Login':(this.form.type==1)?'Registro':'Recuperar contraseña';
        }
    }
});