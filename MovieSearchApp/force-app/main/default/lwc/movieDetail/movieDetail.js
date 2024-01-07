import { LightningElement,wire } from 'lwc';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
} from 'lightning/messageService';
import MOVIE_CHANNEL from '@salesforce/messageChannel/movieChannel__c';
export default class MovieDetail extends LightningElement {

    subscription = null;
    movieId;
    movieDetailData={};
    loadingComponent = false;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                MOVIE_CHANNEL,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    handleMessage(message) {
        this.movieId = message.movieId;
        console.log(this.movieId);
        this.fetchMovieDetail(this.movieId);
    }

    
    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    async fetchMovieDetail(movieId) {
        let url = `https://www.omdbapi.com/?i=${this.movieId}&plot=full&apikey=bf84683`;
        const res = await fetch(url);
        const data = await res.json();
        this.movieDetailData=data;
        console.log(data);
        this.loadingComponent=true;
        
    }
}