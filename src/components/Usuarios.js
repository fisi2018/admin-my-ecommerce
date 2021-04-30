import { useState,useEffect } from "react";
import axios from "axios";
import {API} from "../config";
import "./Categorias.css";
import "./Productos.css";
import "./Usuarios.css";
import DeleteIcon from '@material-ui/icons/Delete';

export default function Usuarios(){
    const [users,setUsers]=useState([]);
    const[form,setForm]=useState({});
    const [error,setError]=useState({
        new:false,
        err:""
    });
    const [isSubmit,setIsSubmit]=useState({
       bool:false,
       add:false,
       added:"",
        deleted:""
    });
    const showMessage=(ruta)=>{
        const $message=document.getElementById(ruta);
        $message.classList.toggle("note-active");
        setTimeout(()=>{
            $message.classList.toggle("note-active");
            setIsSubmit({
                bool:false,
                deleted:""
            });
            setError({
                new:false,
                err:""
            })
        },2000);
    }
    const getUsers= async ()=>{
        try{
            const res=await axios.get(`${API}/user/users`);
            const json=await res.data;
            if(json.error){
                setError({
                    new:true,
                    err:json.error
                });
                setIsSubmit({
                    bool:true
                });
                showMessage("message-delete");
            }else{
                setUsers(json);
            }
        }catch(err){
            setError({
                new:true,
                err
            });
            setIsSubmit({
                bool:true
            });
            showMessage("message-delete");
        }
    }
    useEffect(()=>{
        getUsers();
    },[]);
    useEffect(()=>{
        getUsers();
    },[isSubmit.add || isSubmit.bool]);
    const addUser= async ()=>{
        try{
            const res = await axios.post(`${API}/user/createUser`,{
                name:form.name,
                username:form.username,
                password:form.password,
                role:form.role
            });
            const json= await res.data;
            if(json.error){
                setError({
                    new:true,
                    err:json.error
                });
                setIsSubmit({
                    add:true
                });
                showMessage("message-add");
            }else{
                setIsSubmit({
                    add:true,
                    added:json.name
                });
                showMessage("message-add");
            }
        }catch(err){
            setError({
                new:true,
                err
            });
            setIsSubmit({
                add:true
            });
            showMessage("message-add");
        }
    }
    const handleChange=(e)=>{
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }
    const eliminar= async (id)=>{
        try{
            const res= await axios.delete(`${API}/user/${id}`);
            const json=await res.data;
            if(json.error){
                setError({
                    new:true,
                    err:json.error
                });
                setIsSubmit({
                    bool:true
                });
                showMessage("message-delete");
            }else{
                setIsSubmit({
                    bool:true,
                    deleted:json.message
                });
                showMessage("message-delete");
            }
        }catch(err){
            setError({
                new:true,
                err
            });
            setIsSubmit({
                bool:true
            });
            showMessage("message-delete");
        }
    }
    return(
        <div className="categorias-block">
            <h1>Usuarios</h1>
            <ul className="categorias-container">
                <li className="category-element product-size user-size">
                    <p>Nombre</p><p>Usuario</p><p>Rango</p><p>Acción</p>
                </li>
            {users.map((el)=>(
                <li key={el._id} className="user-size category-element product-size">
                    <p>{el.name}</p>
                    <p>{el.username}</p>
                    <p>{el.role}</p>
                    <div className="container-button" >

                    <button onClick={()=>eliminar(el._id)} className="button-logout">
                        <DeleteIcon/>
                        <p>Eliminar</p></button>
                    </div>
                </li>
            ))}
            </ul>
            {isSubmit.bool && ((error.new)?<h2 id="message-delete"> {error.err}</h2>
            :<h2 id="message-delete"> {isSubmit.deleted} </h2>)}
            <div className="form-block user-field">
                <h2>Agregar nuevo usuario</h2>
                <input onChange={handleChange} className="input-element" name="name" placeholder="Nombre" type="text"/>
                <input onChange={handleChange} className="input-element" name="username" placeholder="Usuario" type="email"/>
                <input onChange={handleChange} className="input-element" name="password" placeholder="Contraseña" type="password"/>
                <input onChange={handleChange} className="input-element" name="role" placeholder="Rango" type="number"/>
                <button  onClick={addUser} className="button-element">Agregar</button>
            </div>
             {isSubmit.add && ((error.new)?<h2 id="message-add"> {error.err}</h2>
            :<h2 className="note" id="message-add">Se ha agregado {isSubmit.added} exitosamente </h2>)}
        </div>
    );
}