import React, { useEffect, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import axios from 'axios';
import { LeafletMouseEvent } from "leaflet"

import "./styles.css";
import logo from "../../assets/logo.svg";
import api from "../../services/api";
import { Item, UF, City } from "./models";

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<UF[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedUf, setSelectUf] = useState<string>("0");
  const [selectedCity, setSelectCity] = useState<string>("0");
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [location, setLocation] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position =>{
      const { latitude, longitude } = position.coords;
      setLocation([latitude, longitude]);
    });
  }, [])

  useEffect(() => {
    api
      .get('items')
      .then(response => { setItems(response.data); });
  }, [])

  useEffect(() => {
    axios
      .get<UF[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then(response => { 
        setUfs(response.data); 
      });
  }, [])

  useEffect(() => {
    axios
      .get<City[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/distritos`)
      .then(response => {
        if(selectedUf === "0") return;
        setCities(response.data);
      })
  }, [selectedUf])

  function handlerSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    setSelectUf(event.target.value);
  }

  function handlerSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    setSelectCity(event.target.value);
  }

  function handlerMapClick(event: LeafletMouseEvent ) {
    const { lat, lng } = event.latlng;
    setSelectedPosition([lat, lng]);
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para Home
        </Link>
      </header>

      <form>
        <h1>
          Cadastro do
          <br /> ponto de coleta
        </h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="text" name="email" id="email" />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione um endereço do mapa</span>
          </legend>

          <Map center={location} zoom={13} onClick={handlerMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (uf)</label>
              <select name="uf" id="uf" value={selectedUf} onChange={handlerSelectUf}>
                <option value="0">Selecione um estado</option>
                {ufs.map(uf => (
                  <option key={uf.id} value={uf.sigla}>{uf.sigla}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city" value={selectedCity} onChange={handlerSelectCity}>
                <option value="0">Selecione uma cidade</option>
                {cities.map(city => (
                  <option  key={city.id} value={city.nome}>{city.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Ítems de coleta</h2>
            <span>Selecione um ou mais items abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => (
              <li key={item.id}>
                <img src={item.image_url} alt={item.name} />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
