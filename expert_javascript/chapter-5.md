# **Chapter - 5 Living Asynchronously**

JavaScript is single-threaded, which means the developers must handle long-running processes more clevery. This chapter explains the various mechanisms available through JavaScript or the Browser to help properly plan and write responsicode.

## **Understanding Concurrency in JavaScript**

When researching this topic, I realized that many people confliate concurrent execution with the ability to run asynchonous execution is ofen used to achieve the appearance of concurrency.

### Concurrency

In a programming context, *concurrency* is the ability for two or more computaional procedure to execute simultaneously while sharing resources. These processes (sometimes called *threads*) can either share a single processor or be distributed across a network and syncronized later by an execution manager.

### **Advantages of Concurrency**

* Increasing the number of programs that can be run at the time.
* Allowing programs that have resource-independent sequential steps to be processed out of order. This is specially useful if an intermediate step is of an unknown duration.
* Applications do not become unresponsive while long-running taks complete.
* Tasks that have prerequisites for execution can be queued for later until those dependencies have been met.

### **Disadvantages of Concurrency**

* Two process that list each other as a prerequisites can wait for each other indefinitely. This is sometimes called *deadlock*.
* Race conditions can occur when the result of a process is dependent on a specific sequence or timing that cannt be guaranteed due to paralled execution.
* Management and synchronization operatins is more complex than sequential execution.
* Concurrent programs ofen are many times more resource-intensivy. Multiple process may be executing in paralled and there is overhead to marshal and synchronize them together.
* Data integrity can be lost when concurrent operations corrupt each other's state due to a failure be correctly synchronized.

## **Understanding JavaScript Event Loop**

Now that you understand concurrency in general, you can evaluate JavaScript's approach to running programs, which is to continually look for incoming messages to process.

### Run-to-Completion

JavaScript's event loop is designed as a run-to-completion environment. Practically, speaking this means that once JavaScript begins to execute a task, it cannot be interrupted until it complete.

> *Each message is processed completed before any other message is processed. This offers some nice properties when reasoning about your program, including the fact that whenever a functions runs, it cannot be pre-empted and will run entirely before any other code runs.*

### Heap

The *heap* is an order-agnostic container in memory.

### Frame

The *frame* is a sequential unit of work needing to be performed during the event loop.

### Stack

The event loop *stack* contains all the sequential steps (*frames*) that a message requires to execute.

```javascript

const sum = function(a, b) {
    return a + b;
}

const addOne = function(num) {
    return sum(1, num)
}

addOne(10)

```

At the point where the addOne() message moves from the queue to the stack, it becomes the base frame. I'll call this frame0. Frame0 contains a reference to the addOne() function and the value of the num argument (currently 10). Because addOne() depends on the sum() function, a new frame is created (frame1), which contains a reference to the sum() function and the values of the incoming arguments 'a' and 'b'. In this example, frame1 has no other dependencies that need to be met. So the stack can now be unwound starting with frame1 and working its way down.

### Queue

The *queue* is a list of message waiting to be processed. When a stack is empty, the oldest message in the queue is added to the stack as the next base frame.

## **Callbacks**

The design of JavaScript's event loop forces code to execute sequentially. Knowing this means writing synchronous code will afford developers a great deal of clarity because they can write code in way that it will be run.

```javascript
var person = {};
var bank = {
    funds: 0,
    receiveDepositFrom: function(person) {
        this.funds += person.fund;
        person.funds = 0;
    }
};

// => undefined
console.log(person.funds);
person.funds = (function work() {
    return 100;
})();

// => 100
console.log(person.funds);
bank.receiveDepositFrom(person);

// => 0
console.log(person.funds)
```

### Perceived Performance

Many programs rely on functions that do not immediately return value. Imagine if the work() function took some time to complete instead of immediately returning.

```javascript
person.funds = (function work() {
    // simulate a long running task;
    var end = Date.now() + 4000;
    while(Date.now() < end) {
        // noop
    }
    return 100;
})();

var person = {};
var bank = {
    funds: 0,
    receiveDepositFrom: function(person) {
        // Now NaN because person.funds is undefined
        this.funds += person.funds;
        person.funds = 0;
    }
};

// => undefined
document.write(person.funds);
(function work() {
    // assume you have JQuery installed
    $.ajax({
        url: 'https://api.github.com/users',
        context: document.body
    }).done(function() {
        person.funds = 100;
    });
})(person);

// => undefined
document.write(person.funds);
bank.receiveDepositFrom(person);

// => 0
document.write(person.funds);
```

Instead of passing in the person object as an argument to the work() function, you could sent a function that *callback* to the previous context once the AJAX request completes. Callbacks are once of the most popular patterns for controlling data flow. A *callback*.

> A callback in JavaScript is the act of passing a function object as an argument to another function, which is to be used on the return value.

In effect, callbacks allow you decouple the current lexical context from synchronous execution of code. Callbacs are a from of continuation passing style.

### Continuation Passing Style

*Continuation Passing Style* (CPS) is a concept popular in functional programming paradigms, where a program's state is controlled through the use of continuations.

```javascript
var person = {};
var bank = {
    funds: 0,
    receiveDepositFrom: function(person) {
        // Now NaN because person.funds is undefined
        this.funds += person.funds;
        person.funds = 0;
    }
};

// => undefined
document.write(person.funds);
(function work(callback) {
    // assume you have JQuery installed
    $.ajax({
        url: 'https://api.github.com/users',
        context: document.body
    }).done(function() {
        callback(100);
    });
})(function(amount) {
    person.funds = amount;
    // => undefined
    document.write(person.funds);
    bank.receiveDepositFrom(person);

    // => 0
    document.write(person.funds);
});

```

### Callback Hell

Synchronous design flatten the code base, which can improve charity, but over time it reduces your ability to organize and reuse code. CPS can fix this issue.

```javascript
    login('user', 'password', function(result) {
        if (result.ok) {
            getProfile(function(result) {
                if (result.ok) {
                    updateProfile(result.user, function(result) {
                        if (result.ok) {
                            callback(user);
                        }
                    });
                }
            });
        }
    }, callback);
```

Callback hell is aplty named because it does the following;

* Makes code harder to read and maintain.
* Makes code less modular and tougher to separate into concern.
* Makes error propagation and exception handling more difficult.
* Lacks a formalized API, so callbacks may or may not be returned

## **Promises: Back from the Future**

A Promise is a *token object the represent the future values or exception of a function that has not yet returned*. Promises ofter a clean and easy-to-read approach for wrangling asynchronous execution back into a visual sequential control flow.
