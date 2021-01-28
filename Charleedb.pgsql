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
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id bigint NOT NULL,
    email character varying(255),
    password character varying(100),
    type character varying(50),
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: about; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.about (
    about_text character varying NOT NULL,
    profile_img character varying NOT NULL,
    about_id integer NOT NULL
);


ALTER TABLE public.about OWNER TO postgres;

--
-- Name: about_about_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.about_about_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.about_about_id_seq OWNER TO postgres;

--
-- Name: about_about_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.about_about_id_seq OWNED BY public.about.about_id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    msg_id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    msg character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    read boolean
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: messages_msg_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_msg_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.messages_msg_id_seq OWNER TO postgres;

--
-- Name: messages_msg_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_msg_id_seq OWNED BY public.messages.msg_id;


--
-- Name: navigation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.navigation (
    nav_id integer NOT NULL,
    title character varying NOT NULL,
    nav_link character varying NOT NULL,
    display_name character varying
);


ALTER TABLE public.navigation OWNER TO postgres;

--
-- Name: navigation_nav_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.navigation_nav_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.navigation_nav_id_seq OWNER TO postgres;

--
-- Name: navigation_nav_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.navigation_nav_id_seq OWNED BY public.navigation.nav_id;


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
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public."Users".id;


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: about about_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.about ALTER COLUMN about_id SET DEFAULT nextval('public.about_about_id_seq'::regclass);


--
-- Name: messages msg_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN msg_id SET DEFAULT nextval('public.messages_msg_id_seq'::regclass);


--
-- Name: navigation nav_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.navigation ALTER COLUMN nav_id SET DEFAULT nextval('public.navigation_nav_id_seq'::regclass);


--
-- Name: pictures picture_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pictures ALTER COLUMN picture_id SET DEFAULT nextval('public.pictures_picture_id_seq'::regclass);


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, email, password, type, "updatedAt", "createdAt") FROM stdin;
1	torun.wikstrom@gmail.com	password	admin	2021-01-25 21:59:22.94471+01	2021-01-25 21:59:22.94471+01
\.


--
-- Data for Name: about; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.about (about_text, profile_img, about_id) FROM stdin;
<p>ÔÇ£Lorem ipsum <strong>dolor </strong>sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad <strong>minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate </strong><i><strong>velit </strong></i><strong>esse cillum dolore eu fugiat nulla pariatur. </strong>Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.ÔÇØ</p>	/pictures/profilenew.jpg	1
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (msg_id, name, email, msg, created_at, read) FROM stdin;
21	grgwrf	torun.wikstrom@gmail.com	efwefwe	2021-01-23 01:22:17.987919+01	\N
22	dfdfg	torun.wikstrom@gmail.com	fgsfgsrg	2021-01-23 01:23:55.118356+01	\N
23	fmewkfm	torun.wikstrom@gmail.com	kfemkefmq├Â	2021-01-23 01:25:52.995621+01	\N
20	sdfsdf	torun.wikstrom@gmail.com	dsfsdf	2021-01-23 01:22:06.667399+01	t
\.


--
-- Data for Name: navigation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.navigation (nav_id, title, nav_link, display_name) FROM stdin;
1	home	/	home
3	sculptures	/sculptures	Skulpturer
4	about	/about	Om mig
5	contact	/contact	Kontakt
2	paintings	/paintings	Tavlor
\.


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
-- Name: about_about_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.about_about_id_seq', 1, true);


--
-- Name: messages_msg_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_msg_id_seq', 23, true);


--
-- Name: navigation_nav_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.navigation_nav_id_seq', 5, true);


--
-- Name: pictures_picture_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pictures_picture_id_seq', 56, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: about about_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.about
    ADD CONSTRAINT about_pkey PRIMARY KEY (about_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (msg_id);


--
-- Name: navigation navigation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.navigation
    ADD CONSTRAINT navigation_pkey PRIMARY KEY (nav_id);


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
-- Name: Users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: Users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT users_username_key UNIQUE (email);


--
-- PostgreSQL database dump complete
--

