import "./Ordenes.css";
import "./Categorias.css";
import {API} from "../config";
import Loader from "./Loader";
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import { useState,useEffect } from "react";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {methodDelete, methodGet, showMessage} from "./Tools";
import axios from "axios";
export default function Ordenes(){
    const [ordenes,setOrdenes]=useState([]);
    const[list,setList]=useState({});
    const [loading,setLoading]=useState(true);
    const[isSubmit, setIsSubmit]=useState({
        bool:false,
        deleted:""
    });
    const[error,setError]=useState({
        new:false,
        err:""
    });
    const getOrdenes= ()=>{
        const url=`${API}/order/orders`;
        methodGet(url,axios,(err)=>{
            setError({new:true,err});
            setIsSubmit({bool:true});
            setLoading(false);
        },(json)=>{setOrdenes(json);
        setLoading(false)});
    }
    useEffect(()=>{
        getOrdenes();
        if(isSubmit.bool){
            showMessage("message-delete");
            setIsSubmit({
                ...isSubmit,
                bool:false
            });
            setError({...error,new:false});
        }
    },[isSubmit.bool]);
    const completeOrder= (id)=>{
        const url=`${API}/order/${id}`;
        methodDelete(url,axios,(err)=>{
            setError({new:true,err});
            setIsSubmit({bool:true});
        },(message)=>{
            setIsSubmit({bool:true, deleted:message});
        })
    }
    return(
        <div className="categorias-block">
            <h1>Ordenes</h1>
            <ul className="categorias-container">
                <li className="category-element product-size">
                    <p>Nombre</p>
                    <p>Celular</p>
                    <p>Dirección</p>
                    <p>Monto total</p>
                    <p>Acciones</p>
                </li>
                {
                    ordenes.map((el)=>(
                            <>
                        <li className="category-element product-size">
                            <p>{el.name}</p>
                            <p>{el.phone}</p>
                            <p>{el.address}</p>
                            <p>{el.total}</p>
                            <div>

                            <button onClick={()=>(list[el._id])?setList({
                                ...list,
                                [el._id]:false
                            }):setList({
                                ...list,
                                [el._id]:true
                            })} className="button-logout" >
                                <VisibilityIcon/>
                                <p>Ver orden</p></button>
                            </div>
                            <div>

                            <button className="button-logout" onClick={()=>completeOrder(el._id)}>
                                <CheckCircleIcon/>
                                <p>Completar orden</p>
                            </button>
                            </div>
                        </li>
                        {list[el._id] && <div key={el._id} className="details-container">
                            {
                                el.list.map((obj)=>(
                                    <li key={obj._id} className="category-element orden-style">
                                        <p>{obj.producto._id}</p>
                                        <p>{obj.producto.name}</p>
                                        <p>{obj.size}</p>
                                        <p>{obj.color}</p>
                                        <p>{obj.count}</p>
                                    </li>
                                ))
                            }
                            </div>}
                            </>
                    ))
                }
            </ul>
            {(!loading && ordenes.length===0) ? 
        <div className="container-complete"><h2>Todas las entregas han sido completadas</h2><AssignmentTurnedInIcon style={{color:"gray"}}/></div>     
        :( loading && <Loader/>) }
            {(error.new)?<h2 id="message-delete"> {error.err}</h2>
            :<h2 className="note" id="message-delete"> {isSubmit.deleted} </h2>}
        </div>
    )
}