<template>
  <span>
    <nav-vue>

      <router-view/>

    </nav-vue>
    <search-restaurant-vue>
      <form @submit.prevent="searchMenuItem()">

          <div class="form-group">
              <label for="search">Search your food</label>
              <input v-model="search" type="text" class="form-control" id="search" aria-describedby="search-help" placeholder="ex: nachos, chicken, ravioli etc...">
              <small id="search-help" class="text-muted">There is always one near you!</small>
          </div>

          <div class="row">
            <div class="col-md-4">
              <button class="btn btn-block btn-warning" type="submit">Search</button>
            </div>
          </div>

        </form>
    </search-restaurant-vue>

    <div class="container mt-4">
        <div class="row">
          <div v-for="item in items" :key="item.id" class="col-md-4">
            <div class="card">
              <div class="card-body">

                <h3>{{ item.name }}</h3>
                <dl v-if="item.offers && item.offers.length">
                  <dt>Price</dt>
                  <dd>${{ item.offers[0].Price }}</dd>
                </dl>

                <small>
                  <em>
                    <a target="_blank" rel="noopener nofollow" :href="`https://www.allmenus.com${ restaurants[ item.restaurant_id ].link }`">{{ restaurants[ item.restaurant_id ].name }}</a>
                  </em>
                </small>

                <div class="text-right" v-if="restaurants[ item.restaurant_id ].grubhub">
                  <a :href="restaurants[ item.restaurant_id ].grubhub" target='_blank' rel="noopener nofollow">
                    <img width="90" src="https://www.allmenus.com/static/images/order-on-seamless-button.png" alt="">
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
  </span>
</template>

<script>
import NavVue from '@/components/NavVue';

import SearchRestaurantVue from '@/components/SearchRestaurantVue'

import db from './../../db'

export default {

  name: 'App',

  components:{

    NavVue, SearchRestaurantVue

  },

  data() {

    return {

      search: '', items: [], restaurants: {}
    }

  },
  mounted(){
    db.collection( 'restaurants' ).get().then( querySnapshot =>{
      let restaurants = {};
      querySnapshot.forEach( ( doc ) =>{
        let restaurant = doc.data();
        restaurants[ restaurant.id ] = restaurant;
      });
      this.restaurants = restaurants;
    });
  },

  methods:{
  // funções comuns para aplicaão nesta página

    searchMenuItem(){
    // procurar por menus usando firebase

      db.collection( 'menu_items' ).where( 'name', '==', this.search ).get().then( querySnapshot =>{
      // excutando a consulta ao banco de dados firebase trazendo objeto default
        
        let items = [];
        // criando uma lista para os resultados

        querySnapshot.forEach( ( doc ) =>{
        // snapshot para recuperar os dados na collection
          
          let item = doc.data();
          // recueperando cada dados

          items.push(item);
          // adicionado os dados na lista
          
          // console.log(doc.id, ' => ', doc.data());
          // debug para info sobre os dados no banco

        });

        this.items = items
        // passando os dados vindo do banco de dados para uma variável local

        // console.log(items);
        // debug
      });
    }
  }
}
</script>

<style>
@import url(https://bootswatch.com/4/simplex/bootstrap.min.css);
/* imprtação do template bootstrap simplex */


</style>
