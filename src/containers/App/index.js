import "./index.css";
import {useEffect, useRef} from "react";

function App() {
	const targetElement = useRef(null);

	useEffect(() => {
		let scene;
		import("../../utils/threejs/index")
			.then(({boxScene}) => {
				scene = boxScene;
				scene.initGame(targetElement.current);
				scene.renderScene();
			});

		return () => {
			scene.destroyScene();
		};
	}, []);

	return (
		<div
			className="App"
			ref={targetElement}
		>
		</div>
	);
}

export default App;
