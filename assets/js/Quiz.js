const e = React.createElement;

const quizLevels = 
[
    level('Com quantos paus se faz uma canoa?', [alt('1', true), alt('Depende', true), alt('5', true), alt('3', true)]),
    level('Quem descobriu o Brasil?', [alt('Pedro Alvares Cabral', true), alt('Jorge Lima', false), alt('Antônio Fagundes', false), alt('Cristóvão Colombo', false)]),
    level('Qual o tamanho de uma baleia?', [alt('Grande para burro', true)]),
    level('Duvido acertar essa', [alt('Eu vou', false), alt('Essa é fácil', false), alt('Mas eu vou', false), alt('Eu sabia essa com maçãs', false)]),
    level('...', [alt('Sim', false), alt('Não', false), alt('Provavelmente', true)])
];

function level(question, alternatives)
{
    return { question: question, alternatives: alternatives };
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

        this.state = { level: 0, finished: false, points: 0 };
    }

    render()
    {
        if (this.state.finished)
        {
            return e('div', { id: 'victory' }, 
                e('h2', { id: 'victory-message' }, `Você não fez mais que a obrigação e acertou ${this.state.points} de ${quizLevels.length} em: `),
                e(Timer, { key: Timer.currentKey, playing: false }),
                e('input', { id: 'try-again', type: 'button', value: 'Outra vez!', onClick: () => this.replay() })
            );
        }

        return e('div', { id: 'quiz' },
            e('h3', { id: 'level-indicator' }, `Questão ${this.state.level + 1} de ${quizLevels.length}`),
            e('p', { id: 'question' }, quizLevels[this.state.level].question),
            e('div', { id: 'alternatives' },
                quizLevels[this.state.level].alternatives.map((alt, i) => 
                    e('input', { className: 'alternative', key: i, type: 'button', value: alt.text, onClick: () => this.submitAnswer(i) })
                )
            ),
            e(Timer, { key: Timer.currentKey, playing: true })
        );
    }

    submitAnswer(option)
    {
        if (quizLevels[this.state.level].alternatives[option].correct) this.setState(state => ({ points: state.points + 1 }));

        if (this.state.level === quizLevels.length - 1) this.setState({ finished: true });
        else this.setState(state => ({ level: state.level + 1 }));
    }

    replay()
    {
        Timer.currentKey++;

        this.setState({ finished: false, level: 0, points: 0 });
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
        return e('p', { id: 'timer' }, this.Time);
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

const container = document.querySelector('#game-container');
ReactDOM.render([e('h1', { id: 'title', key: 0 }, 'React Quiz'), e(Quiz, { key: 1 })], container);