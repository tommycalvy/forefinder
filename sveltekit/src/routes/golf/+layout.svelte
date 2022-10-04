
<div class="golf-layout">
    <div class="golf-nav">
        <div class="golf-title">
            <h2>Golf</h2>
        </div>
        <a href="/golf/home"><h3>Home</h3></a>
        <a href="/golf/discover"><h3>Discover</h3></a>
        <a href="/golf/events"><h3>Events</h3></a>
        <a href="/golf/friends"><h3>Friends</h3></a>
        <a href="/golf/profile"><h3>Profile</h3></a>
        <button>+ Invite Friend</button>
    </div>
    <slot />
</div>


<style>
    .golf-layout {
        display: grid;
        grid-template-columns: 20rem auto;
        height: 100vh;
    }

    .golf-nav {
        display: flex;
        flex-direction: column;
        justify-content: first;
        text-align: center;
        border-right: 0.1rem solid gainsboro;
    }

    .golf-nav h3 {
        cursor: pointer;
        padding: 1rem 0;
        border-radius: 0.5rem;
        margin: 1rem 0.5rem;
    }

    .golf-nav h3:hover {
        background-color: gainsboro;
    }

    button {
        margin: 0 1rem;
    }
</style>