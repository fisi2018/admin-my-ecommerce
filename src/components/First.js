import {useState,useEffect,useRef} from "react";
import "./First.css";
import {Home,header,aside} from "./Home";
import axios from "axios";
import Cookies from "universal-cookie";
import Productos from "./Productos";
import Ordenes from "./Ordenes";
import Usuarios from "./Usuarios";
import Categorias from "./Categorias";
import Publicaciones from "./Publicaciones";
import {API} from "../config";
import React,{BrowserRouter as Router, Route, Switch,Link} from "react-router-dom";
const bcrypt=require("bcryptjs");
const cookies=new Cookies();
export const First=()=>{
    const burger=useRef();
    const burger2=useRef();
    const asidePanel=useRef();
    const [isLogin,setIsLogin]=useState(false);
    const [form,setForm]=useState({});
    useEffect(() => {
        (cookies.get("id"))?setIsLogin(true):setIsLogin(false);
        
    }, [])
    const sendInformation= async ()=>{
        
           
                 try{
                    const res= await  axios.get(`${API}/user/users`);
                 const json= await res.data;  
                
                 if(json.length>0){
                     let response;
                json.forEach((user)=>{
                    if(user.username===form.username && bcrypt.compareSync(form.password,user.password)){
                        response=user;
                        cookies.set("id",response._id,{path:"/"});
                       cookies.set("username",response.username,{path:"/"});
                     cookies.set("name",response.name,{path:"/"});
                      cookies.set("role",response.role,{path:"/"});
                     setIsLogin(true);
                    }
                    else{
                        console.log("USUARIO Y/O CONTRASEÑA INCORRECTAS");
                    }
                })
                 }else{
                  
                     console.log("HA OCURRIDO UN ERROR");
                 }

                    
                }catch(err){
                    
                    console.log("HA OCURRIDO UN ERROR", err)
                }
       
    }
    const handleChange=(e)=>{
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }
    const login=()=>{
        return(
            <div className="container-form">
            <h1>Bienvenido a Admin-MyEcommerce</h1>
                <div className="form-block" >
                    <h2>Inicio de Sesión</h2>
                    <h3>Usuario</h3>
                    <input onChange={handleChange} placeholder="Username" className="input-element" name="username" type="email" />
                    <h3>Contraseña</h3>
                    <input onChange={handleChange} placeholder="Password" className="input-element" name="password" type="password"/>
                    <button onClick={sendInformation} className="button-element">Login</button>
                </div>
            </div>
        )
    }
    return(
        <>
            {isLogin?
                <Router>
                {header(burger,burger2,asidePanel)}
                {aside(burger,burger2,asidePanel)}
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/ordenes" component={Ordenes} />
                    <Route exact path="/productos" component={Productos}/>
                    <Route exact path="/categorias" component={Categorias}/>
                    <Route exact path="/publicaciones" component={Publicaciones}/>
                    {cookies.get("role")==="1" && <Route exact path="/usuarios" component={Usuarios} />}
                    
                </Switch>
            </Router>
            : login()}
        </>
    )
}