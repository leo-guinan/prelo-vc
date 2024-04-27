import RadarChart from "@/components/analyze/radar";
import {ChartData} from "chart.js";
import {useEffect, useState} from "react";

interface ScoresProps {
    scores: {
        market: {
            score: number
            reason: string
        },
        team: {
            score: number
            reason: string
        },
        founder: {
            score: number
            reason: string
        },
        product: {
            score: number
            reason: string
        },
        traction: {
            score: number
            reason: string

        }
    }
}

export default function Scores({scores}: ScoresProps) {
    const [data, setData] = useState<ChartData<"radar"> | null>(null)
    useEffect(() => {
        console.log(scores)
        if (scores) {
            console.log(scores.market.score)
            console.log(scores.team.score)
            console.log(scores.founder.score)
            console.log(scores.product.score)
            console.log(scores.traction.score)
            setData({
                labels: ['Market', 'Team', 'Founder/Market Fit', 'Product', 'Traction'],
                datasets: [
                    {
                        label: 'Your Startup',
                        data: [scores.market.score, scores.team.score, scores.founder.score, scores.product.score, scores.traction.score],
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Average Startup',
                        data: [5, 5, 5, 5, 5],
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }

                ]
            })
        }
    }, [scores]);

    const options = {
        scales: {
            r: {
                angleLines: {
                    display: false
                },
                suggestedMin: 0,
                suggestedMax: 10
            }
        }
    };

    return (
        <div>
            <h1>Pitch Deck Scores</h1>
            {data && (
                <RadarChart data={data} options={options}/>
            )}
        </div>
    );
}