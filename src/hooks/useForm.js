import {useState,useEffect} from "react";
import axios from "axios";
import {API} from "../config";
import Cookies from "universal-cookie";
const bcrypt=require("bcryptjs");
const cookies=new Cookies();

export const useForm=(initialForm,validateForm)=>{
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState(initialForm);
    const [isSubmit, setIsSubmit] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    useEffect(() => {
        (cookies.get("id"))?setIsLogin(true):setIsLogin(false);
        
    }, [])
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setForm({
            ...form,
            [name]:value
        })
    }
    const handleBlur=(e)=>{
        handleChange(e);
        setErrors(validateForm(form));
    }
    const handleSubmit= async (e)=>{
        e.preventDefault();
        setErrors(validateForm(form));
        if(Object.keys(errors).length===0){
            setIsSubmit(true);
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
                        setErrors({
                            ...errors,
                            login:"Usuario y/o contraseña incorrectas"
                        })
                        setIsSubmit(false);
                    }
                })
                 }else{
                  
                     setErrors({
                         ...errors,
                         servidor:json.error
                     })
                 }
                }catch(err){
                    setErrors({
                        ...errors,
                        system:`Ha ocurrido un error: ${err}`
                    })
                }
        }else{
            return;
        }
    }
    return {
        errors,
        form,
        isSubmit,
        isLogin,
        handleChange,
        handleBlur,
        handleSubmit
    }
}