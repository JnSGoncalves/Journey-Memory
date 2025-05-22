# 📌 Memory Journey

<p align="center">
  <img src="assets\images\page_inicial.png" alt="Memory Journey Logo" height="300">
</p>

Este é o repositório de um projeto de aplicativo mobile desenvolvido em React Native. Memory Journey é um aplicativo com o objetivo de ser um ponto central de compartilhamento de fotos e comentários sobre viagens realizados por seus usuários.

Este é um projeto [Expo](https://expo.dev) criado com [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## 🛠️ Utilização

1. Instale as dependências

   ```bash
   npm install
   ```

2. Inicie o aplicativo

   ```bash
   npx expo start
   ```

## 📃 Descrição do projeto

Este projeto utiliza um banco de dados Firebase Firestore para armazenar os dados de usuários e postagens realizadas no app, além da utilização da API Cloudinary para realização do upload das fotos nas postagens, que são visualizadas através de suas urls.

## 🔨 Recursos

- Cadastro / Login de usuários
- Listagem de todos as postagens
- Visualização de uma postagem
- Criação de uma postagem
- Exclusão de uma postagem realizada

### O projeto é separado em 5 telas:
#### Tela Inicial:

<p align="center">
   <img src="assets\images\tela_inicial_full.png" alt="Memory Journey Logo" height="500">
</p>

#### Tela de postagens:

<p align="center">
   <img src="assets\images\tela_posts.jpg" alt="Memory Journey Logo" height="500">
</p>

#### Tela de Descrição de postagens:

<p align="center">
   <img src="assets\images\tela_desc-posts.jpg" alt="Memory Journey Logo" height="500">
</p>

#### Tela de Usuário:

<p align="center">
   <img src="assets\images\tela_login.jpg" alt="Memory Journey Logo" height="500">
   <img src="assets\images\tela_logado.jpg" alt="Memory Journey Logo" height="500">
</p>

#### Criação de Posts:

<p align="center">
   <img src="assets\images\tela_novo-post.jpg" alt="Memory Journey Logo" height="500">
</p>


## ➕ Ferramentas utilizadas

- Expo
- Firebase Firestore
- Cloudinary API
- [Phosphor Icons]('https://phosphoricons.com/') (Icones SVG)
