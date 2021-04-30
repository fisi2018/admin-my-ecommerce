import { useEffect,useState } from "react";
import axios from "axios";
import "./Categorias.css";
import {API} from "../config";
import DeleteIcon from '@material-ui/icons/Delete';
export default function Categorias(){
    const [categories,setCategories]=useState([]);
     const[isSubmit, setIsSubmit]=useState({
        bool:false,
        deleted:""
    });
    const[error,setError]=useState({
        new:false,
        err:""
    });
    const showMessage=()=>{
        const $message=document.getElementById("message-delete");
        $message.classList.toggle("note-active")
        
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
    const getCategories= async ()=>{
        try{
            const res= await axios.get(`${API}/category/categories`);
            const json=await res.data;
            if(json.error){
                setIsSubmit({
                    bool:true
                })
                setError({
                    new:true,
                    err:json.error
                });
                showMessage();
            }
            else{
                console.log("JUSTO ANTES DE SETEAR CATEGORIES");
                setCategories(json);
            }
        }catch(err){
            setIsSubmit({
                bool:true
            });
            setError({
                new:true,
                err
            });
            showMessage();
        }

    }
    useEffect(()=>{
        getCategories();
    },[]);
    useEffect(()=>{
        getCategories();
    },[isSubmit.bool])
    const eliminar= async (id)=>{
        try{
            
            const res= await axios.delete(`${API}/category/${id}`)
            const json= await res.data;
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
            <h1>Categorías</h1>
            <ul className="categorias-container">
                <li className="category-element first"><p>ID</p><p>CATEGORÍA</p><p>ACCIÓN</p></li>
                { categories.map( (el)=>(
                    <li className="category-element" key={el._id} ><p>{el._id}</p><p>{el.name}</p><button className="button-logout" onClick={()=>eliminar(el._id)} >
                        <DeleteIcon /><p >Eliminar</p>
                        </button></li>
                      )      ) }
            </ul>
            {isSubmit.bool && ((error.new)?<h2 id="message-delete"> {error.err}</h2>
            :<h2 className="note" id="message-delete"> {isSubmit.deleted} </h2>)}
        </div>
    )
}