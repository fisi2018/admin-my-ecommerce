import { useState,useEffect } from "react";
import axios from "axios";
import "./Categorias.css";
import "./Publicaciones.css";
import "./Productos.css";
import {API} from "../config";
import VisibilityIcon from '@material-ui/icons/Visibility';
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
    const showMessage=()=>{
        const $message=document.getElementById("message-delete");
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
    const getPublicaciones=async ()=>{
        try{
            const res=await axios.get(`${API}/table/tables`);
            const json=await res.data;
            if(json.error){
                setError({
                    new:true,
                    err:json.error
                });
                setIsSubmit({
                    bool:true
                })
                showMessage();
            }else{
                setTables(json);
            }
        }catch(err){
            setError({
                new:true,
                err
            });
            setIsSubmit({
                bool:true
            });
        }
    }
useEffect(()=>{
    getPublicaciones();
},[]);
useEffect(()=>{
    getPublicaciones();
},[isSubmit]);
    const eliminar= async (id)=>{
    try{
        const res = await axios.delete(`${API}/table/${id}`);
        const json = await res.data;
        if(json.error){
            setError({
                new:true,
                err:json.error
            });
            setIsSubmit({
                bool:true
            });
            showMessage();
        }else{
            setIsSubmit({
                bool:true,
                deleted:json.message
            });
            showMessage();
        }
    }catch(err){
        setError({
            new:true,
            err
        });
        setIsSubmit({
            bool:true
        });
        showMessage();
    }

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
            {isSubmit.bool && ((error.new)?<h2 className="error" id="message-delete"> {error.err}</h2>
            :<h2 className="note" id="message-delete"> {isSubmit.deleted} </h2>)}
        </div>
    )
}