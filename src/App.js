import React, { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default () => {

  const[movielist, setmovielist] = useState([]);
  const[feturedData, setFeaturedData] = useState([]);
  const[blackHeader, setBlackHeader] = useState(false);

  useEffect(()=>{
    const loadAll = async () =>{
      //pegando a lista TOTAL
      let list = await Tmdb.getHomeList();
      setmovielist(list);

      //pegando o Featured
      let originals = list.filter(i=>i.slug=='originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length))
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
    }

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10){
        setBlackHeader(true);
      }else{
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, [])

  return(
    <div className="page">

      <Header black={blackHeader} />

      {FeaturedMovie &&
        <FeaturedMovie item={feturedData} />
      }

      <section className="lists">
        {movielist.map((item, key)=>(
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Desenvolvido por André Felipe em 2021 |
        Direitos de imagens para Netflix<span role="img" aria-label="coração">🧡</span><br/>
        Dados pegos do site Themoviedb.org |
        Em aprendizado com a escola B7WEB 
      </footer>

      {movielist.length <= 0&&
      <div className="loading">
        <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="Carregando" />
      </div>
      }
    </div>
  );
}