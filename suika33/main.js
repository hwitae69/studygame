import { FRUITS } from "./fruits.js";

const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Events = Matter.Events;

// 앤진 선언
const engine = Engine.create();

// 렌더 선언
const render = Render.create({
    engine,
    element: document.body,
    options:{
        wireframes: false, // true면 색 적용 안됨 
        background: '#F7F4C8', // 배경
        width: 620,
        height: 850,
    }
});

// 월드 선언
const world = engine.world;

// 왼쪽벽 생성
const leftWall = Bodies.rectangle(15,395,30,790,{
    isStatic: true, // 고정해주는 기능
    render: {fillStyle: '#E6B143'}
});

const rightWall = Bodies.rectangle(605,395,30,790,{
    isStatic: true, // 고정해주는 기능
    render: {fillStyle: '#E6B143'}
});

const ground = Bodies.rectangle(310,820,620,60,{
    isStatic: true, // 고정해주는 기능
    render: {fillStyle: '#E6B143'}
});

const topLine = Bodies.rectangle(310,150,620,2,{
    isStatic: true, // 고정해주는 기능
    isSensor: true,
    render: {fillStyle: '#E6B143'}
});
// 벽 배치
World.add(world,[leftWall,rightWall,ground,topLine]);

Render.run(render);
Runner.run(engine);

// 현재 과일값을 저장할 변수 생성
let currentBody = null;
let currentFruit = null;

// 키 조작을 제어하는 변수 생성
let disableAction = false; 

// 과일 떨어지는 함수 만들기 
const addFruit = ()=>{
    // 과일 Index 저장
    const index = Math.floor(Math.random()*5);    
    const fruit = FRUITS[index];
    const body = Bodies.circle(300,50,fruit.radius,{
        index: index,
        isSleeping: true,
        render:{
            sprite: {texture : `${fruit.name}.png`},
        },
        restitution : 0.5 
    });

    currentBody = body;
    currentFruit = fruit;
    World.add(world,body);
}

window.onkeydown = (e) =>{

    // 제어 조작 변수가 true인 경우 바로 리턴 
    if (disableAction) return;

    switch(e.code){
        case "KeyA":
            Body.setPosition(currentBody,{
                x:currentBody.position.x-10,
                y: currentBody.position.y
            })
            break
        case "KeyD":
            Body.setPosition(currentBody,{
                x:currentBody.position.x+10,
                y: currentBody.position.y
            })
            break;
        case "KeyS":
            currentBody.isSleeping = false;
            disableAction = true;
            setTimeout(()=>{
                addFruit();
                disableAction = false
            },1000)
            break;    
    }
}

Events.on(engine, "collisionStart", (event) => {

    event.pairs.forEach((collision) => {
        if (collision.bodyA.index == collision.bodyB.index) {

            const index = collision.bodyA.index;

            World.remove(world, [collision.bodyA, collision.bodyB]);

            const newFruit = FRUITS[index + 1];
            console.log(newFruit.radius)
            const newBody = Bodies.circle(

                collision.collision.supports[0].x,
                collision.collision.supports[0].y,
                newFruit.radius,
                {
                    index : index + 1,
                    render : {sprite : {texture : `${newFruit.name}.png`}},
                }

            );

            World.add(world, newBody);
        };

    });

})

addFruit();