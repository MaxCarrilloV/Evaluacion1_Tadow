import React, {  createContext, useContext,useState, useMemo, useEffect } from "react";
import { setToken, getToken, deleteToken } from "../Helpers/usuario";
import clienteAxios from "../Helpers/clienteAxios";

import { useIniciarSesion } from "../Queries/LoginQuery";
import { useMutation } from "react-query";

const UsuarioContext = createContext();

const UsuarioProvider = (props) => {
  const [usuario, setUsuario] = useState(null);

  const { mutate, isLoading : cargandoUsuario} = useMutation(useIniciarSesion, {
    onSuccess: (response) => {
      setToken(response.access_token);
      getUsuario();
      window.location = "/";
    },
    onError: (error) => {
      setToken(null);
    },
  });

  const loginUsuario = async (form) => {
    mutate(form);
  };

  const getUsuario = async () => {
    if (!getToken()) {
      return;
    }

    try {
      const { data } = await clienteAxios.get("/user");
      setUsuario(data);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    setUsuario(null);
    deleteToken();
    window.location = "/login";
  };

  useEffect(() => {
    getUsuario();
  }, []);

  const value = useMemo(() => {
    return {
      usuario,
      cargandoUsuario,
      loginUsuario,
      logout
    };
  }, [usuario, cargandoUsuario,loginUsuario,logout]);

  return <UsuarioContext.Provider 
  value={value} 
  {...props} 
  />;
};

const useUsuario = () => {
  return useContext(UsuarioContext);
};

export { UsuarioProvider, useUsuario };