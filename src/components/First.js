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
import Loader from "./Loader";
import {API} from "../config";
import {validationForm} from "./Tools";
import {useForm} from "../hooks/useForm";
import React,{BrowserRouter as Router, Route, Switch,Link} from "react-router-dom";
const bcrypt=require("bcryptjs");
const cookies=new Cookies();
const initialForm={
    username:"",
    password:""
}
export const First=()=>{
    const burger=useRef();
    const burger2=useRef();
    const asidePanel=useRef();
    const {form,errors,isSubmit,isLogin,handleChange,handleBlur,handleSubmit}=useForm(initialForm,validationForm);
    
    const login=()=>{
        return(
            <div className="container-form">
            <h1>Bienvenido a Admin-MyEcommerce</h1>
                <form onSubmit={handleSubmit} className="form-block" >
                    <h2>Inicio de Sesión</h2>
                    <h3>Usuario</h3>
                    <input onBlur={handleBlur} onChange={handleChange} placeholder="Username" className="input-element" name="username" type="email" required />
                    {errors.username && <p className="validation-message" >{errors.username}</p> }
                    <h3>Contraseña</h3>
                    <input onBlur={handleBlur} onChange={handleChange} placeholder="Password" className="input-element" name="password" type="password" required />
                    {errors.password && <p className="validation-message">{errors.password}</p> }
                    {(!isSubmit)? 
                    <input className="button-element" type="submit" value="Login" />
                    : <Loader/> }
                    {errors.login && <p className="validation-message" >{errors.login}</p> }
                </form>
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