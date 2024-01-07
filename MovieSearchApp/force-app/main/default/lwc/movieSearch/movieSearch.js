import { LightningElement,wire,api } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import MOVIE_CHANNEL from '@salesforce/messageChannel/movieChannel__c';

const DELAY=300;
export default class MovieSearch extends LightningElement {
    selectedType="";
    selectedMovie="";
    loading=false;
    selectedPageno="1";
    delayTimeout
    searchResult;
    selectedmov;
    displaySearchResult=false;

    @wire(MessageContext)
    messageContext;

    get selectedpOptions() {
        return[
            {label:"None" , value:""},
            {label:"Movie" , value:"movie"},
            {label:"Series", value:"series"},
            {label:"Episode", value:"episode"}
        ];
    }


    handleChange(event) {
        const names=event.target.name;
        this.loading=true;
        if(names === 'type') {
            this.selectedType=event.target.value;
        }
        else if(names=== 'search') {
            this.selectedMovie=event.target.value;
        }
        else if(names==='pageno') {
            this.selectedPageno=event.target.value;
        }

        clearTimeout(this.delayTimeout);
        
        this.delayTimeout= setTimeout(()=>{
            this.searchMovie();
        },DELAY)

        
    }
    
    //api call 
    async searchMovie() {
        
        //https://www.omdbapi.com/?s=Batman&page=2
        const url= `https://www.omdbapi.com/?s=${this.selectedMovie}&type=${this.selectedType}&page=${this.selectedPageno}&apikey=bf84683`;
        const res=await fetch(url);
        const data = await res.json();
        console.log(data);

        this.loading=false;
        
        if(data.Response==="True") {
            this.searchResult=data.Search;
            if(this.searchResult!=null) {
                this.displaySearchResult=true;
            }
        }
    }

    movieSelectedHandler(event) {
        this.selectedmov=event.detail;

        const payload = { movieId: this.selectedmov };

        publish(this.messageContext, MOVIE_CHANNEL, payload);
    }


    

}