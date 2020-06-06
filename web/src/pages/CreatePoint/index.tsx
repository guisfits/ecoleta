import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import axios from 'axios';
import { LeafletMouseEvent } from "leaflet"

import "./styles.css";
import logo from "../../assets/logo.svg";
import api from "../../services/api";
import { Item, UF, City } from "./models";
import Dropzone from '../../components/dropzone'

const CreatePoint = () => {
  // * Fields

  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<UF[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedUf, setSelectUf] = useState<string>("0");
  const [selectedCity, setSelectCity] = useState<string>("0");
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [location, setLocation] = useState<[number, number]>([-23.5866135, -46.6838599]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  })

  const history = useHistory();

  // * Initializations

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setLocation([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    api
      .get('items')
      .then(response => { setItems(response.data); });
  }, [])

  useEffect(() => {
    axios
      .get<UF[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      .then(response => {
        setUfs(response.data);
      });
  }, [])

  useEffect(() => {
    axios
      .get<City[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/distritos?orderBy=nome`)
      .then(response => {
        if (selectedUf === "0") return;
        setCities(response.data);
      })
  }, [selectedUf])

  // * Handlers

  function handlerSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    setSelectUf(event.target.value);
  }

  function handlerSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    setSelectCity(event.target.value);
  }

  function handlerMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;
    setSelectedPosition([lat, lng]);
  }

  function handlerInputChange(event: ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  function handlerSelectItem(item: Item) {
    const alreadySelected = selectedItems.findIndex(id => id === item.id) >= 0;

    if (alreadySelected) {
      setSelectedItems(selectedItems.filter(id => id !== item.id));
    }
    else {
      const set = new Set<number>();
      selectedItems.forEach(item => set.add(item));
      set.add(item.id);

      setSelectedItems(Array.from(set.values()));
    }
  }

  async function handlerSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = new FormData();
    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));

    if (selectedFile) {
      data.append('image', selectedFile);
    }

    await api.post('points', data);

    history.push('/');
  }

  // * HTML

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para Home
        </Link>
      </header>

      <form onSubmit={handlerSubmit}>
        <h1>
          Cadastro do
          <br /> ponto de coleta
        </h1>

        <Dropzone onFileUploaded={setSelectedFile}></Dropzone>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" onChange={handlerInputChange} />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="text" name="email" id="email" onChange={handlerInputChange} />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" onChange={handlerInputChange} />
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
                  <option key={city.id} value={city.nome}>{city.nome}</option>
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
              <li
                key={item.id}
                onClick={() => handlerSelectItem(item)}
                className={selectedItems.includes(item.id) ? "selected" : ""}
              >
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
