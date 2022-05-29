const e = React.createElement;

const quizLevels = 
[
    level('Com quantos paus se faz uma canoa?', [alt('1', true), alt('Depende', true), alt('5', true), alt('3', true)]),
    level('Quem descobriu o Brasil?', [alt('Pedro Alvares Cabral', true), alt('Jorge Lima', false), alt('Antônio Fagundes', false), alt('Cristóvão Colombo', false)])
];

function level(question, alternatives)
{
    return { question: question, alternatives: alternatives.splice(0, 4) };
}

function alt(text, isCorrect)
{
    return { text: text, correct: isCorrect };
}

class Quiz extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = { level: 0, win: false };
    }

    render()
    {
        if (this.state.win)
        {
            return e('div', null, 
                e('h1', null, "Parabéns!!!!!!!!!!!!! Não fez mais que a sua obrigação."), 
                e(Timer, { key: Timer.currentKey, playing: false }),
                e('input', { type: 'button', value: 'Outra vez!', onClick: () => this.replay() })
            );
        }

        return e('div', null,
            e(Timer, { key: Timer.currentKey, playing: true }), 
            e('p', null, quizLevels[this.state.level].question),
            quizLevels[this.state.level].alternatives.map((alt, i) => 
                e('input', { key: i, type: 'button', value: alt.text, onClick: () => this.submitAnswer(i) })
            )
        );
    }

    submitAnswer(option)
    {
        if (quizLevels[this.state.level].alternatives[option].correct)
        {
            if (this.state.level === quizLevels.length - 1) this.setState({ win: true });
            else this.setState(state => ({ level: state.level + 1 }));
        }
        else this.replay();
    }

    replay()
    {
        Timer.currentKey++;

        this.setState({ win: false, level: 0 });
    }
}

class Timer extends React.Component
{
    static currentKey = 0;

    constructor(props)
    {
        super(props);

        this.state = { seconds: 0 };
    }

    render()
    {
        return e('p', null, this.Time);
    }

    get Time()
    {
        const date = new Date(0);

        date.setSeconds(this.state.seconds);

        const time = date.toISOString();
        
        return time.substring(11, time.length - 5);
    }

    tick()
    {
        if (this.props.playing) this.setState(state => ({ seconds: state.seconds + 1 }));
    }

    componentDidMount()
    {
        this.interval = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount()
    {
        clearInterval(this.interval);
    }
}

const container = document.querySelector('#quiz-container');
ReactDOM.render(e(Quiz), container);