class BaseCharacter{
  constructor(name, hp, ap){
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.ap = ap
    this.alive = true;
  }

  getHurt(damage){
    this.hp -= damage;
    if (this.hp <= 0){
      this.hp = 0;
      this.die()
    }

    var _this = this;
    var i = 1;

    _this.id = setInterval(function(){
      if (i == 1){
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = damage;
      }

      _this.element.getElementsByClassName("effect-image")[0].src = "img/effect/blade/" +i+".png";
      // _this.element.updateHtml(hpElement,hurtElement);
      i++;

      if (i > 8){
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = "";
        clearInterval(_this.id);
      }
    },50);
  }

  die(){
      this.alive = false;
  }

  attack(character, damage){
    if(this.alive == false){
      return;
    }
    character.getHurt(damage);
  }

  updateHtml(hpElement, hurtElement){
    hpElement.textContent = this.hp;
    hurtElement.style.width = (100 - this.hp/this.maxHp*100)+"%";
  }
  
}

class Hero extends BaseCharacter{
  constructor(name, hp, ap){
    super(name, hp, ap);

    this.element = document.getElementById("hero-image-block");
    this.hpElement = document.getElementById("hero-hp");
    this.hurtElement = document.getElementById("hero-hp-hurt");
    this.maxHpElement = document.getElementById("hero-max-hp");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;
    console.log("召喚英雄 " + this.name + "!");
  }

  attack(character){
    var damage = Math.random()*(this.ap/2)+(this.ap/2);
    super.attack(character, Math.round(damage));
    // console.log("hero.attack");
  }

  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }

  heal(){
    if (this.maxHp - this.hp > 30){
      this.hp+=30;
    }
    else{
      this.hp = this.maxHp;
    }
    this.updateHtml(this.hpElement, this.hurtElement);

    var _this = this;
    var i = 1;

    _this.id = setInterval(function(){
      if (i == 1){
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        _this.element.getElementsByClassName("heal-text")[0].classList.add("healed");
        _this.element.getElementsByClassName("heal-text")[0].textContent = "30";
      }

      _this.element.getElementsByClassName("effect-image")[0].src = "img/effect/heal/" +i+".png";
      // _this.element.updateHtml(hpElement,hurtElement);
      i++;
      if (i > 8){
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("heal-text")[0].classList.remove("healed");
        _this.element.getElementsByClassName("heal-text")[0].textContent = "";
        clearInterval(_this.id);
      }
    },50);

  }
}

class Monster extends BaseCharacter{
  constructor(name, hp ,ap){
    super(name, hp, ap);

    this.element = document.getElementById("monster-image-block");
    this.hpElement = document.getElementById("monster-hp");
    this.maxHpElement = document.getElementById("monster-max-hp");
    this.hurtElement = document.getElementById("monster-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log("遇到怪獸 "+ this.name +" 了");
  }

  attack(character){
    var damage = Math.random()*(this.ap/2)+(this.ap/2);
    super.attack(character, Math.round(damage));
  }
  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

var round = 10;
  function endTurn(){
    round--;
    document.getElementById("round-num").textContent = round;
    if(round<1){
      finish();
    }
  }

function heroAttack(){
  document.getElementsByClassName("skill-block")[0].style.display = "none";
  setTimeout(function(){
    hero.element.classList.add("attacking");
    setTimeout(function(){
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    },500);
  },100);

  setTimeout(function(){
    if(monster.alive){
      monster.element.classList.add("attacking");
      setTimeout(function(){
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        if(hero.alive == false){
          finish();
        }
        else{
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      entered = !entered;
      },500);
    }
    else{
      finish();
    }
  },1100);

}

function heroHeal(){
  document.getElementsByClassName("skill-block")[0].style.display = "none";
  // console.log("heal image disapear")
  setTimeout(function(){
    setTimeout(function(){
      hero.heal();
    },500);
  },100);

  setTimeout(function(){
    monster.element.classList.add("attacking");
    setTimeout(function(){
      monster.attack(hero);
      monster.element.classList.remove("attacking");
      endTurn();
      if(hero.alive == false){
        finish();
      }
      else{
        document.getElementsByClassName("skill-block")[0].style.display = "block";
      }
      // console.log(entered + "after finish");
    entered = !entered;
    },500);
  },1100);
}

var entered = true;
function finish(){
  // console.log(entered + "finish");
  // entered = !entered; 
  entered = true;
  var dialog = document.getElementById("dialog");
  dialog.style.display = "block";
  if (monster.alive == false){
    dialog.classList.add("win");
  }
  else{
    dialog.classList.add("lose");
  }
}


//==========================interface==========================
function addSkillEvent(){
  var skill = document.getElementById("skill");
  skill.onclick = function(){
    heroAttack();
  }

  var heal = document.getElementById("heal");
  heal.onclick = function(){
    heroHeal();
  }
}

document.onkeyup = function(enent){
  var key = String.fromCharCode(event.keyCode);
  if (entered){
    entered = !entered; //entered = false
    if (key == "A"){
      heroAttack();
      // entered = !entered;
    }
    else if(key == "D"){
      heroHeal();
      // entered = !entered;
    }
    // setTimeout(function(){
    //   entered = !entered;
    // },1600);
  }
  
}



var hero = new Hero("Bernard", 130, 30);
var monster = new Monster("Skeleton", 130, 40);

addSkillEvent();