CREATE DATABASE casoscovid;
\c casoscovid

CREATE EXTENSION pgcrypto;

CREATE TABLE IF NOT EXISTS public.sexo
(
    id serial NOT NULL,
    sexo varchar(1),
    PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS public.ciudad
(
    id serial NOT NULL,
    ciudad varchar(30),
    departamento varchar(60),
    PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS public.grupo_sanguineo
(
    id serial NOT NULL,
    gs varchar(2),
    PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS public.rh
(
    id serial NOT NULL,
    rh varchar(1),
    PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS public.userdata
(
    cedula integer NOT NULL,
    apellidos varchar(40) NOT NULL,
    estatura integer NOT NULL,
    fecha_exp date NOT NULL,
    gs integer NOT NULL,
    lugar_nacimiento integer NOT NULL,
    fecha_nacimiento date NOT NULL,
    nombres varchar(40) NOT NULL,
    sexo integer NOT NULL,
    lugar_exp integer NOT NULL,
    rh integer NOT NULL,
    estado integer NOT NULL,
    PRIMARY KEY (cedula),
    FOREIGN KEY (gs)
        REFERENCES public.grupo_sanguineo (id) MATCH SIMPLE,
    FOREIGN KEY (lugar_nacimiento)
        REFERENCES public.ciudad (id) MATCH SIMPLE,
    FOREIGN KEY (sexo)
        REFERENCES public.sexo (id) MATCH SIMPLE,
    FOREIGN KEY (lugar_exp)
        REFERENCES public.ciudad (id) MATCH SIMPLE,
    FOREIGN KEY (rh)
        REFERENCES public.rh (id) MATCH SIMPLE
)

CREATE TABLE IF NOT EXISTS public.usuario
(
    usuario character varying(30) NOT NULL,
    pass character varying(255) NOT NULL,
    PRIMARY KEY (usuario)
)