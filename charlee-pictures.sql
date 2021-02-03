--
-- PostgreSQL database dump
--

-- Dumped from database version 13.1
-- Dumped by pg_dump version 13.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: pictures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pictures (
    picture_id integer NOT NULL,
    filename character varying NOT NULL,
    picture_type character varying NOT NULL,
    price character varying NOT NULL,
    caption character varying NOT NULL,
    description character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.pictures OWNER TO postgres;

--
-- Name: pictures_picture_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pictures_picture_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pictures_picture_id_seq OWNER TO postgres;

--
-- Name: pictures_picture_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pictures_picture_id_seq OWNED BY public.pictures.picture_id;


--
-- Name: pictures picture_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pictures ALTER COLUMN picture_id SET DEFAULT nextval('public.pictures_picture_id_seq'::regclass);


--
-- Data for Name: pictures; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pictures (picture_id, filename, picture_type, price, caption, description, created_at) FROM stdin;
1	img/pictures/1.jpg	paintings	200kr	Sunset	Oil on canvas	2020-12-20 21:22:14.094286
8	img/pictures/8.jpg	sculpture	300kr	Sunset	Oil on canvas	2020-12-20 21:22:14.094286
40	/pictures/17.jpg	paintings	231	rgf	qwe	2020-12-27 23:41:36.213998
3	img/pictures/3.jpg	paintings	200kr	Sunset	Oil on canvas	2020-12-20 21:22:14.094286
4	img/pictures/4.jpg	sculpture	300kr	Sunset	Oil on canvas	2020-12-20 21:22:14.094286
5	img/pictures/5.jpg	paintings	200kr	Sunset	Oil on canvas	2020-12-20 21:22:14.094286
6	img/pictures/6.jpg	sculpture	300kr	Sunset	Oil on canvas	2020-12-20 21:22:14.094286
7	img/pictures/7.jpg	paintings	200kr	Sunset	Oil on canvas	2020-12-20 21:22:14.094286
2	img/pictures/2.jpg	sculpture	300kr	Sunset	Oil on paper	2020-12-20 21:22:14.094286
35	/pictures/12.jpg	sculpture	23	dgdfg	dfg	2020-12-27 23:38:01.581461
36	/pictures/13.jpg	paintings	20	erewe	erwefr	2020-12-27 23:38:28.303142
37	/pictures/14.jpg	sculpture	55	ghhgn	htrh	2020-12-27 23:39:00.598908
38	/pictures/15.jpg	paintings	555	rthrh	rthrth	2020-12-27 23:39:25.94564
39	/pictures/16.jpg	sculpture	5	hgt	rtgrg	2020-12-27 23:41:01.900179
9	img/pictures/9.jpg	paintings	200kr	Sunset	Oil on canvas	2020-12-20 21:22:14.094286
\.


--
-- Name: pictures_picture_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pictures_picture_id_seq', 56, true);


--
-- Name: pictures pictures_filename_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pictures
    ADD CONSTRAINT pictures_filename_key UNIQUE (filename);


--
-- Name: pictures pictures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pictures
    ADD CONSTRAINT pictures_pkey PRIMARY KEY (picture_id);


--
-- PostgreSQL database dump complete
--

