# How to avoid this React Hooks performance pitfall

[React Hooks](https://reactjs.org/docs/hooks-intro.html) promise to avoid the overhead of class components while delivering all the same benefits. For example, they allow us to write stateful functional components without having to worry about storing state on the class instance.

However, writing stateful components with Hooks requires care. There's a subtle difference between how state is initialized in the constructor of a class component and how it is initialized by the [`useState`](https://reactjs.org/docs/hooks-state.html) hook. Developers who already understand class components and think of Hooks simply as class components without the class stuff are at risk of writing components that perform worse than class components.

Here, I discuss a feature of `useState` that is [only mentioned briefly](https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily) in the official Hooks FAQ. Understanding this feature in detail will allow you to get the most out of React Hooks. In addition to reading this note, I invite you to play around with [Stress Testing React Hooks](https://www.matthiasjenny.com/stress-hooks/), a benchmark tool I wrote to illustrate these peculiarities of Hooks.

## The options prior to React Hooks

Suppose you have some expensive calculation that needs to happen just once when setting up your component, and suppose that this calculation depends on some prop. A plain functional component does a very bad job at this:

```jsx
function FunctionalComponent(props) {
  const result = expensiveCalculation(props.arg);
  // ...
}
```

This performs very poorly, because the expensive calculation is carried out on every render.

Class components improve on this by allowing us to carry out a given operation only once, for example in the constructor:

```jsx
class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { result: expensiveCalculation(this.props.arg) };
  }

  // ...
}
```

By storing the result of the calculation on the instance, in this case inside of the component's local state, we can bypass the expensive calculation on each subsequent render. You can see the difference that this makes by comparing the class component and the functional component with [my benchmark tool](https://www.matthiasjenny.com/stress-hooks/).

But class components have their own drawbacks, as [mentioned](https://reactjs.org/docs/hooks-intro.html#motivation) in the official React Hooks docs. That's why Hooks were introduced.

## A naive implementation with `useState`

The `useState` hook can be used to declare a "state variable" and set it to an initial value. That value can be changed and accessed in subsequent renders. With that in mind, you may naively try to do the following to improve the performance of your functional component:

```jsx
function NaiveHooksComponent(props) {
  const [result] = useState(expensiveCalculation(props.arg));
  // ...
}
```

You may think that since we're dealing with state here that is shared between subsequent renders, the expensive calculation is only carried out on the first render, just like with class components. You'd be wrong.

To see why, recall that `NaiveHooksComponent` is a just a function, a function that is invoked on each render. That means that `useState` is invoked on each render. How `useState` works is [a complicated story](https://medium.com/the-guild/under-the-hood-of-reacts-hooks-system-eb59638c9dba) that need not concern us. What's important is what `useState` is invoked with: It's invoked with the return value of `expensiveCalculation`. But we will only know what that return value is if we actually invoke `expensiveCalculation`. As a result, our `NaiveHooksComponent` is doomed to carry out the expensive calculation on each render, just like our previous `FunctionalComponent` that didn't use `useState`.

So far, `useState` doesn't give us any performance benefits, as can be verified with [my benchmark tool](https://www.matthiasjenny.com/stress-hooks/). (Of course, the array that `useState` returns also contains a function that allows us to easily update the state variable, which is something we couldn't do with a simple functional component.)

## Three ways to memoize expensive calculations

Fortunately, React Hooks provide us with three options to handle state that are just as performant as class components.

### 1. `useMemo`

The first option is to use the [`useMemo`](https://reactjs.org/docs/hooks-faq.html#how-to-memoize-calculations) hook:

```jsx
function MemoHooksComponent(props) {
  const { arg } = props;
  const result = useMemo(() => expensiveCalculation(arg), [arg]);
  // ...
}
```

As a rule of thumb, `useMemo` will only carry out the expensive calculation again if the value of `arg` changes. This is only a rule of thumb though, since future versions of React may occasionally recalculate the memoized value.

The next two options are more reliable.

## 2. Passing functions to `useState`

The second option is to [pass a function to `useState`](https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily):

```jsx
function FunctionHooksComponent(props) {
  const [result] = useState(() => expensiveCalculation(props.arg));
  // ...
}
```

This function is only invoked on the first render. That's super useful. (Though you need to remember that if you want to store an actual function in state, you have to wrap it inside of another function. Otherwise, you end up storing the function's return value instead of the function itself.)

## 3. `useRef`

The third option is to use the [`useRef`](<(https://reactjs.org/docs/hooks-reference.html#useref)>) hook:

```jsx
function RefHooksComponent(props) {
  const ref = useRef(null);
  if (ref.current === null) {
    ref.current = expensiveCalculation(props.arg);
  }
  const result = ref.current;
  // ...
}
```

This one is a bit weird, but it works and it's [officially sanctioned](https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily). `useRef` returns a mutable ref object whose `current` key points to the argument that `useRef` is invoked with. This ref object will persist in subsequent renders. So if we set `current` lazily like we do above, the expensive calculation is only carried out once.

## Comparison

As you can see with [my benchmark tool](https://www.matthiasjenny.com/stress-hooks/), all three of these options are just as performant as our initial class component. However, the behavior of `useMemo` may change in the future. So if you want to have a guarantee that the expensive calculation is only carried out once, you should either use option 2, which passes a function to `useState`, or option 3, which uses `useRef`.

The choice between these two options comes down to whether you ever want to update the result of the expensive calculation.Think of the difference between option 2 and option 3 as analogous to the difference between storing something in `this.state` or storing it in `this` directly.
