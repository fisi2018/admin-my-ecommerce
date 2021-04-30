import { useState,useEffect } from "react";
import axios from "axios";
import "./Categorias.css";
import "./Publicaciones.css";
import "./Productos.css";
import {API} from "../config";
import VisibilityIcon from '@material-ui/icons/Visibility';
import {methodDelete, methodGet, showMessage} from "./Tools";
import DeleteIcon from '@material-ui/icons/Delete';
export default function Publicaciones(){
    const [error,setError]=useState({
        new:false,
        err:""
    });
    const [isSubmit,setIsSubmit ]=useState({
        bool:false,
        deleted:""
    });
    const [tables, setTables]=useState([]);
    const getPublicaciones=async ()=>{
        const url=`${API}/table/tables`;
        methodGet(url,axios,(err)=>{
            setError({new:true,err});
            setIsSubmit({bool:true});
        },(json)=>setTables(json));
    }
useEffect(()=>{
    getPublicaciones();
},[]);
useEffect(()=>{
    getPublicaciones();
    if(isSubmit.bool){
        showMessage("message-delete");
        setIsSubmit({...isSubmit,bool:false});
        setError({...error,new:false});
    }
},[isSubmit.bool]);
    const eliminar= (id)=>{
        const url=`${API}/table/${id}`;
        methodDelete(url,axios,(err)=>{
            setError({new:true,err});
            setIsSubmit({bool:true});
        },(message)=>setIsSubmit({bool:true,deleted:message}));
}

    return(
        <div className="categorias-block">
            <h1>Publicaciones</h1>
            <ul className="categorias-container" >
                <li className="category-element product-size" >
                    <p>Título</p>
                    <p>Tema</p>
                    <p>Acciones</p>
                </li>
                {tables.map((el)=>(
                    <li key={el._id} className="category-element product-size">
                        <p>{el.title}</p>
                        <p>{el.category}</p>
                        <div className="container-button">
                        <button className="button-logout">
                            <VisibilityIcon/>
                            <p>Ver detalles</p>
                        </button>

                        </div>
                        <div className="container-button">

                        <button  onClick={()=>eliminar(el._id)} className="button-logout">
                            <DeleteIcon/>
                            <p>Eliminar</p>
                        </button>
                        </div>
                    </li>
                ))}
            </ul>
            {(error.new)?<h2 className="error" id="message-delete"> {error.err}</h2>
            :<h2 className="note" id="message-delete"> {isSubmit.deleted} </h2>}
        </div>
    )
}