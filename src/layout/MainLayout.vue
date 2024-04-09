<template>
    <div class="main-layout">
      <header>
        <nav>
          <ul>
            <li><router-link to="/">Main Page</router-link></li>
          </ul>
        </nav>
      </header>
      
  
      <main>
        <slot></slot> 
      </main>
  
      <footer>
        <p>© 2024 Palace of Fantasy. All rights reserved.</p>
      </footer>
    </div>
  </template>
  
  <script>

  </script>

<style lang="scss" scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  header {
    background-color: var(--primary-color);
    padding: 20px 0;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;

    nav {
      width: 100%;
      ul {
        list-style-type: none;
        display: flex;
        justify-content: center;
        margin: 0;
        padding: 0;

        li {
          margin: 0 15px;
        }

        a {
          color: #fff;
          &:hover {
            color: var(--accent-color);
          }
        }
      }
      .navbar-toggle {
        background: none;
        border: none;
        color: #fff;
        font-size: 2rem;
        cursor: pointer;
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        padding: 20px;
        z-index: 101;
    
        &:focus {
          outline: none;
        }
      }
    }
  }

  main {
    padding: 20px;
    padding-top: 60px;
    flex-grow: 1;
    background-color: transparent;
  }

  footer {
    background-color: var(--primary-color);
    color: var(--text-color);
    text-align: center;
    padding: 10px;
    border-top: 1px solid var(--border-color);
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;
    main {
      padding-bottom: 50px;
    }

    p {
      margin: 0;
    }
  }
}

</style>


  


