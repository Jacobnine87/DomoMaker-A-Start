const handleDomo = (e) => {
	e.preventDefault();

	$("#domoMessage").animate({width:'hide'},350);

	if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#favoriteFruit").val() == '') {
		handleError("RAWR! All fields are required!");
		return false;
	}

	sendAjax('POST', $("#domoForm").attr('action'), $("#domoForm").serialize(), function() {
		loadDomosFromServer($('#csrf').val());
	});

	return false;
};

const handleDelete = (e) => {
	e.preventDefault();

	sendAjax('DELETE', $("#deleteDomoForm").attr('action'), $("#deleteDomoForm").serialize(), function() {
		loadDomosFromServer($('#csrf').val());
	});
};

const DomoForm = (props) => {
	return (
		<form id="domoForm"
			onSubmit={handleDomo}
			name="domoForm"
			action="/maker"
			method="POST"
			className="domoForm"
		>
			<label htmlFor="name">Name: </label>
			<input id="domoName" type="text" name="name" placeholder="Domo Name"/>
			<label htmlFor="age">Age: </label>
			<input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
			<label htmlFor="favoriteFruit">Domo's Favorite Fruit: </label>
			<input id="favoriteFruit" type="text" name="favoriteFruit" placeholder="Strawberries"/>
			<input id="csrf" type="hidden" name="_csrf" value={props.csrf} />
			<input className="makeDomoSubmit" type="submit" value="Make Domo" />
		</form>
	);
};

const DomoList = (props) => {
	if(props.domos.length === 0) {
		return (
			<div className="domoList">
				<h3 className="emptyDomo">No Domos Yet</h3>
			</div>
		);
	}
	console.log(props);

	const domoNodes = props.domos.map((domo) => {
		return (
			<div key={domo._id} className="domo">
				<img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
				<h3 className="domoName"> Name: {domo.name} </h3>
				<h3 className="domoAge"> Age: {domo.age} </h3>
				<h3 className="domoFruit"> Favorite Fruit: {domo.favoriteFruit} </h3>
				<form id="deleteDomoForm"
					name="deleteDomoForm"
					onSubmit={handleDelete}
					action="/delete"
					method="DELETE"
					className="deleteDomoForm"
				>
					<input type="hidden" name="_csrf" value={props.csrf} />
					<input type="hidden" name="name" value={domo.name} />
					<input className="formSubmit" type="submit" value="&#xe020;"/>
				</form> 
			</div>
		);
	});

	return (
		<div className="domoList">
			{domoNodes}
		</div>
	);
};

const loadDomosFromServer = (csrf) => {
	sendAjax('GET', '/getDomos', null, (data) => {
		ReactDOM.render(
			<DomoList domos={data.domos} csrf={csrf}/>, document.querySelector("#domos")
		);
	});
};

const setup = (csrf) => {
	ReactDOM.render(
		<DomoForm csrf={csrf} />,document.querySelector("#makeDomo")
	);

	ReactDOM.render(
		<DomoList domos={[]} csrf={csrf}/>, document.querySelector("#domos")
	);

	loadDomosFromServer(csrf);
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(() => {
	getToken();
});