
//-------------------------------------Variables-------------------------------------//
//Declare Default Player Stats
const player = {
    name: "Player",
    level: 1,
    hp: 100,
    charClass: "DefaultClass",
    equip: "DefaultEquipment",
};
//Declare Enemey Stats
const enemy = {
    name: "Enemy",
    level: 1,
    hp: 100,
    charClass: "DefaultClass",
    equip: "DefaultEquipment",
};
//Declare Default equipment loadout
const playerEquipment = {
    mainHand: "empty",
    offHand: "empty",
    armor: "empty",
    jewelry: "empty" 
}
//Declare Enemy Equipment
const enemyEquipment = {
    mainHand: "empty",
    offHand: "empty",
    armor: "empty",
}
//Declare Available Mainhands
const mainHand = {
    shortSword: {
        name: "Short Sword",
        attacks: 2,
        damage: 25,
        crit: 1.5,
    },

    longSword: {
        name: "Long Sword",
        attacks: 1,
        damage: 35,
        crit: 2,
    },

    dagger: {
        name: "Dagger",
        attacks: 4,
        damage: 15,
        crit: 2.5,
    },
}
//Declare Available Armor
const armor = {
    leather: {
        name: "leather armor",
        armor: 1,
        speed: 3,
    },

    mail: {
        name: "mail armor",
        armor: 2,
        speed: 2,
    },

    plate: {
        name: "plate armor",
        armor: 3,
        speed: 1,
    },
}
//Declare Available Offhands
const offHand = {
    shield: {
        name: "shield",
        block: 1,
        armor: 1,
    },

    charm: {
        name: "Power Charm",
        attacks: 1,
        damage: 5,
    },
}
//Declare Available Jewelry
const jewelry = {
    necklace: {
        name: "Saftey Necklace",
        deathSave: 1,
    },

    ring: {
        name: "Lucky Ring",
        alwaysCrit: 1,
    },
}
//Declare Classes
const charClass = {
    warrior: {
        name: "warrior",
        heavyStrike: true,
        baseArmor: 1,
        hit: 1,
        actions: 2,
    },

    tank: {
        name: "tank",
        block: true,
        baseArmor: 2,
        hit: 2,
        actions: 2,
    },

    rogue: {
        name: "rogue",
        sneakAttack: true,
        baseArmor: 0,
        hit: 3,
        actions: 2,
    },   
}

let activeEntity = "player";
let attacker;
let defender;

//-------------------------------------UI Elements-------------------------------------//

//Action Bar
const actionBar = document.querySelector(".actions");

//Attack Button
const attackButton = document.querySelector(".attackButton");
attackButton.addEventListener("click", startAttack);

//Move Button
const moveButton = document.querySelector(".moveButton");
moveButton.addEventListener("click", move);

//Class Selection Bar
const classSelection = document.querySelector(".classSelection");

//Class Selection Button
const tankButton = document.querySelector(".tankClass");
const warriorButton = document.querySelector(".warriorClass");
const rogueButton = document.querySelector(".rogueClass");

tankButton.addEventListener("click", pickClass);
warriorButton.addEventListener("click", pickClass);
rogueButton.addEventListener("click", pickClass);

//HP Values
const playerHpBar = document.querySelector(".playerHP");
const enemyHpBar = document.querySelector(".enemyHP");

//CombatLog
const combatLog = document.querySelector(".combatLog");


//-------------------------------------Actions-------------------------------------//
//Attack Actions
function attack(attacker, defender) {
    let hitDamage = 0;
    let attackMessage = "";
    let attackerName = attacker.name;
    let defenderName = defender.name;

    let damage = attacker.equip.mainHand.damage;
    let critDamage = attacker.equip.mainHand.crit;
    let weapon = attacker.equip.mainHand.name;

    let attackerHit = attacker.charClass.hit + (Math.floor(Math.random() * 11));
    let attackerCrit = attacker.charClass.hit + 10;
    let defenderArmor = defender.equip.armor.armor + defender.charClass.baseArmor;

    let result = determineHit(attackerHit, attackerCrit, defenderArmor);

    switch (result){
        case("crit"):
            hitDamage = critDamage * damage;
            attackMessage = (`${attackerName} dealt a critical hit for ${hitDamage} damage with a ${weapon}.`)
            break;

        case("hit"):
            hitDamage = damage;
            attackMessage = (`${attackerName} hit ${defenderName} for ${hitDamage} damage with a ${weapon}.`)
            break;

        case("miss"):
            attackMessage = (`${attackerName} missed their attack.`)
            break;
    }
    return {
        resultDamage: hitDamage,
        resultMessage: attackMessage,
    }
}

function block(defender) {
    let blockMessage = "";
    let blockAmount = 0;
    let defenderName = defender.name;

    blockAmount = (defender.charClass.baseArmor + defender.equip.armor.armor + defender.equip.offHand.armor) * defender.equip.offHand.block;
    blockMessage = `${defenderName} blocked ${blockAmount} damage.`
    
    return {
        resultMessage: blockMessage,
        resultBlock: blockAmount,
    }
}

function move() {
    if (player.charClass.actions > 0) {
        let moveMessage = "You moved!";
        let noMoveMessage = "You can't move any more this turn.";

        updateCombatMessage(moveMessage)
        player.charClass.actions -= 1
        checkIfTurnOver();

    } else {
        updateCombatMessage(noMoveMessage);
    }
}

function heal() {

}

//-------------------------------------Calculations-------------------------------------//

//Calculate Damage
function calculateDamage(attackAmount, blockAmount = 0){
    let damageResult;

    if (blockAmount >= attackAmount) {
        damageResult = 0;
    } else {
        damageResult = attackAmount - blockAmount;
    }

    return damageResult;
}
//Determine if an attack hits, crits, or misses
function determineHit(hit, crit, armor) {
    let result = ""
    
    if (hit === crit) {
        result = "crit";
    } else if (hit >= armor) {
        result = "hit";
    } else {
        result = "miss";
    }
    return result;
}

//Check if entity is dead
function checkDead(target){

}

//-------------------------------------Round Control-------------------------------------//

//Play out a turn
function playerStartTurn() {
    activeEntity = "player";
    attacker = player;
    defender = enemy;

    actionBar.style.backgroundColor = "rgb(127 255 0 / 0.44)";

    const actionButtons = document.querySelectorAll(".actionButton");
    actionButtons.forEach((e) => {
        e.style.display = "flex";
    })
}

function playerEndTurn(){
    activeEntity = "enemy";
    actionBar.style.backgroundColor = "rgb(255 0 0 / 0.44)";

    const actionButtons = document.querySelectorAll(".actionButton");
    actionButtons.forEach((e) => {
        e.style.display = "none";
    })

    actionBar.textContent = "Enemy Turn";
}

function checkIfTurnOver(){
    if (player.charClass.actions <= 0) {
        playerEndTurn();
    }
}

function startAttack() {

    if (attacker.equip.mainHand.attacks > 0){
        //Get Attack Results and declare variables 
        let attackResult = attack(attacker, defender);
        let attackDamage = attackResult.resultDamage;
        let attackMessage = attackResult.resultMessage;

        //Check if defender is blocking
        let blockDamage = 0;
        let blockMessage = "No Damage Was Blocked";

        if (defender.charClass.block === true && attackDamage > 0) {
            let blockResults = block(defender);
            blockDamage = blockResults.resultBlock;
            blockMessage = blockResults.resultMessage;
        }

        // Calculate final damage value after block
        let damageDealt = calculateDamage(attackDamage, blockDamage);
        let resultMessage = `${defender.name} took a total of ${damageDealt}.`

        //Update UI with attack, defend, and final results
        updateCombatMessage(attackMessage, blockMessage, resultMessage);

        //Update HP values
        updateHealthValues(defender, damageDealt);

        //Reduce player attack amount by 1, if attack amount is zero, turn is over
        //Reduce player actions by 1 if they exhuast their attacks
        player.equip.mainHand.attacks -= 1;
        if (player.equip.mainHand.attacks === 0) player.charClass.actions -= 1; 

    } else {
            updateCombatMessage("You can't attack any more this turn");
        }
    
    checkIfTurnOver();    
}

//-------------------------------------Enemy AI-------------------------------------//







//Update Combat Messages
function updateCombatMessage(attackMessage, defenderMessage, resultMessage){
    if (attackMessage != undefined) console.log(attackMessage);
    if (defenderMessage != undefined) console.log(defenderMessage);
    if (resultMessage != undefined) console.log(resultMessage);

    const combatLogInput = document.createElement("div");
    combatLogInput.style.backgroundColor = actionBar.style.backgroundColor;
    combatLogInput.style.padding = "0rem 1rem";

    const combatLogLineBreak = document.createElement("p");
    let lineBreak = "-";
    combatLogLineBreak.textContent = lineBreak.repeat(75);

    if (attackMessage != undefined) {
        let combatMessage = document.createElement("div");
        combatMessage.textContent = attackMessage;
        combatLogInput.appendChild(combatMessage);
    };

    if (defenderMessage != undefined) {
        let combatMessage = document.createElement("div");
        combatMessage.textContent = defenderMessage;
        combatLogInput.appendChild(combatMessage);
    };

    if (resultMessage != undefined) {
        let combatMessage = document.createElement("div");
        combatMessage.textContent = resultMessage;
        combatLogInput.appendChild(combatMessage);
    };

    combatLog.appendChild(combatLogInput);
    combatLog.appendChild(combatLogLineBreak);
    combatLog.scrollTop = combatLog.scrollHeight;
}

//Update Health Values
function updateHealthValues(target, damageTaken){

    if (target.name === "Player") {
        target.hp -= damageTaken;
        console.log(`${target.name} has ${target.hp}HP left.`);
        playerHpBar.textContent = target.hp;
    }

    if (target.name === "Enemy") {
        target.hp -= damageTaken;
        console.log(`${target.name} has ${target.hp}HP left.`);
        enemyHpBar.textContent = target.hp;
    }
}

//-------------------------------------Start of Game-------------------------------------//

function pickClass(entity){
    choosenClass = entity.target.className;
    
    switch(choosenClass){
        case("warriorClass"):
            player.charClass = charClass.warrior;

            playerEquipment.mainHand = mainHand.longSword;
            playerEquipment.armor = armor.mail;

            player.equip = playerEquipment;
            break;

        case("tankClass"):
            player.charClass = charClass.tank;

            playerEquipment.mainHand = mainHand.shortSword;
            playerEquipment.offHand = offHand.shield;
            playerEquipment.armor = armor.plate;

            player.equip = playerEquipment;
            break;   
            
        case("rogueClass"):
            player.charClass = charClass.rogue;

            playerEquipment.mainHand = mainHand.dagger;
            playerEquipment.armor = armor.leather;

            player.equip = playerEquipment;
            break; 
    }
    classSelection.style.display = "none";
}

//Player Testing

enemyEquipment.mainHand = mainHand.longSword;
enemyEquipment.armor = armor.plate;
enemyEquipment.offHand = offHand.shield;
enemy.charClass = charClass.tank;
enemy.equip = enemyEquipment;

playerStartTurn();

//Enemies