/*==============================================================*/
/* Nom de SGBD :  MySQL 5.0                                     */
/* Date de création :  21/02/2025 17:45:33                      */
/*==============================================================*/


drop table if exists CHOISIR_REPONSE;

drop table if exists QUESTION;

drop table if exists QUIZ;

drop table if exists REPONSE;

drop table if exists UTILISATEUR;

/*==============================================================*/
/* Table : CHOISIR_REPONSE                                      */
/*==============================================================*/
create table CHOISIR_REPONSE
(
   ID_UTILISATEUR       numeric(8,0) not null,
   ID_REPONSE           numeric(8,0) not null,
   primary key (ID_UTILISATEUR, ID_REPONSE)
);

/*==============================================================*/
/* Table : QUESTION                                             */
/*==============================================================*/
create table QUESTION
(
   ID_QUESTION          numeric(8,0) not null,
   ID_QUIZ              numeric(8,0) not null,
   TEXTE_QUESTION       varchar(2000) not null,
   TYPE_QUESTION        varchar(10) not null,
   primary key (ID_QUESTION)
);

/*==============================================================*/
/* Table : QUIZ                                                 */
/*==============================================================*/
create table QUIZ
(
   ID_QUIZ              numeric(8,0) not null,
   ID_UTILISATEUR       numeric(8,0) not null,
   DESIGNATION          varchar(200) not null,
   DUREE                numeric(8,0) not null,
   DATE                 date not null,
   HEURE                time not null,
   LIEU                 varchar(200) not null,
   MODULE               varchar(100),
   CYCLE_ETUDE          varchar(200),
   primary key (ID_QUIZ)
);

/*==============================================================*/
/* Table : REPONSE                                              */
/*==============================================================*/
create table REPONSE
(
   ID_REPONSE           numeric(8,0) not null,
   ID_QUESTION          numeric(8,0) not null,
   TEXTE_REPONSE        varchar(2000) not null,
   NOTE                 decimal(2,2) not null,
   primary key (ID_REPONSE)
);

/*==============================================================*/
/* Table : UTILISATEUR                                          */
/*==============================================================*/
create table UTILISATEUR
(
   ID_UTILISATEUR       numeric(8,0) not null,
   USER                 varchar(50) not null,
   MP                   varchar(20) not null,
   PROFILE              varchar(10) not null,
   NOM                  varchar(50),
   PRENOM               varchar(50),
   DN                   date,
   LN                   varchar(50),
   ADRESSE              varchar(200),
   TELEPHONE            numeric(8,0),
   primary key (ID_UTILISATEUR)
);

alter table CHOISIR_REPONSE add constraint FK_CHOISIR_REPONSE foreign key (ID_UTILISATEUR)
      references UTILISATEUR (ID_UTILISATEUR) on delete restrict on update restrict;

alter table CHOISIR_REPONSE add constraint FK_CHOISIR_REPONSE2 foreign key (ID_REPONSE)
      references REPONSE (ID_REPONSE) on delete restrict on update restrict;

alter table QUESTION add constraint FK_COMPOSER foreign key (ID_QUIZ)
      references QUIZ (ID_QUIZ) on delete restrict on update restrict;

alter table QUIZ add constraint FK_ORGANISER foreign key (ID_UTILISATEUR)
      references UTILISATEUR (ID_UTILISATEUR) on delete restrict on update restrict;

alter table REPONSE add constraint FK_CONSTITUER foreign key (ID_QUESTION)
      references QUESTION (ID_QUESTION) on delete restrict on update restrict;

