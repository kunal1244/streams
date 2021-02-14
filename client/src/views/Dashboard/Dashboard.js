import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Camera from "@material-ui/icons/Camera";
import Palette from "@material-ui/icons/Palette";
import Favorite from "@material-ui/icons/Favorite";
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
// import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import NavPills from "components/NavPills/NavPills.js";
import Parallax from "components/Parallax/Parallax.js";

import Tooltip from "@material-ui/core/Tooltip";

import profile from "assets/img/faces/kunal.jpg";

import studio1 from "assets/img/examples/studio-1.jpg";
import studio2 from "assets/img/examples/studio-2.jpg";
import studio3 from "assets/img/examples/studio-3.jpg";
import studio4 from "assets/img/examples/studio-4.jpg";
import studio5 from "assets/img/examples/studio-5.jpg";
import work1 from "assets/img/examples/olu-eletu.jpg";
import work2 from "assets/img/examples/clem-onojeghuo.jpg";
import work3 from "assets/img/examples/cynthia-del-rio.jpg";
import work4 from "assets/img/examples/mariya-georgieva.jpg";
import work5 from "assets/img/examples/clem-onojegaw.jpg";

import apiData from "./apiData.json";

import styles from "assets/jss/material-kit-react/views/profilePage.js";

const useStyles = makeStyles(styles);

export default function ProfilePage(props) {
	const classes = useStyles();
	const { ...rest } = props;
	const imageClasses = classNames(
		classes.imgRaised,
		classes.imgRoundedCircle,
		classes.imgFluid
	);
	const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
	return (
		<div>
			<Header
				color="transparent"
				brand="Streams"
				rightLinks={<HeaderLinks />}
				fixed
				changeColorOnScroll={{
					height: 200,
					color: "white"
				}}
				{...rest}
			/>
			<Parallax small filter image={require("assets/img/profile-bg.jpg")} />
			<div className={classNames(classes.main, classes.mainRaised)}>
				<div>
					<div className={classes.container}>
						<GridContainer justify="center">
							<GridItem xs={12} sm={12} md={6}>
								<div className={classes.profile}>
									<div>
										<img src={profile} alt="..." className={imageClasses} />
									</div>
									<div className={classes.name}>
										<h3 className={classes.title}>Kunal Das</h3>
									</div>
								</div>
							</GridItem>
						</GridContainer>
						<GridContainer justify="center">
							<GridItem xs={12} sm={12} md={12} className={classes.navWrapper}>
								<NavPills
									alignCenter
									color="primary"
									tabs={[
										{
											tabButton: "Genres",
											tabIcon: Camera,
											tabContent: (
												<GridContainer justify="center">
													<GridItem xs={12} sm={12} md={4}>
														<Tooltip
															id="tooltip-left"
															title="A Tribe Called Quest"
															placement="left"
															classes={{ tooltip: classes.tooltip }}
														>
															<img
																alt="..."
																src={studio1}
																className={navImageClasses}
															/>
														</Tooltip>
														
														<Tooltip
															id="tooltip-left"
															title="A Tribe Called Quest"
															placement="left"
															classes={{ tooltip: classes.tooltip }}
														>

														<img
															alt="..."
															src={studio2}
															className={navImageClasses}
														/>
														</Tooltip>
														
													</GridItem>
													<GridItem xs={12} sm={12} md={4}>
														<Tooltip
															id="tooltip-left"
															title="A Tribe Called Quest"
															placement="left"
															classes={{ tooltip: classes.tooltip }}
														>
														<img
															alt="..."
															src={studio5}
															className={navImageClasses}
														/>
														</Tooltip>

														<Tooltip
															id="tooltip-left"
															title="A Tribe Called Quest"
															placement="left"
															classes={{ tooltip: classes.tooltip }}
														>
														<img
															alt="..."
															src={studio4}
															className={navImageClasses}
														/>
														</Tooltip>
														
													</GridItem>
												</GridContainer>
											)
										},
										{
											tabButton: "Artists",
											tabIcon: Palette,
											tabContent: (
												<GridContainer justify="center">
													<GridItem xs={12} sm={12} md={4}>
														<Tooltip
															id="tooltip-left"
															title={apiData.artists[0].name}
															placement="left"
															classes={{ tooltip: classes.tooltip }}
														>
														<img
															alt="..."
															src={apiData.artists[0].images[0].url}
															className={navImageClasses}
														/>
														</Tooltip>

														<Tooltip
															id="tooltip-left"
															title={apiData.artists[1].name}
															placement="left"
															classes={{ tooltip: classes.tooltip }}
														>
														<img
															alt="..."
															src={apiData.artists[1].images[0].url}
															className={navImageClasses}
														/>
														</Tooltip>

														<Tooltip
															id="tooltip-left"
															title={apiData.artists[2].name}
															placement="left"
															classes={{ tooltip: classes.tooltip }}
														>
														<img
															alt="..."
															src={apiData.artists[2].images[0].url}
															className={navImageClasses}
														/>
														</Tooltip>
													</GridItem>
													<GridItem xs={12} sm={12} md={4}>
														<Tooltip
															id="tooltip-left"
															title={apiData.artists[3].name}
															placement="left"
															classes={{ tooltip: classes.tooltip }}
														>
														<img
															alt="..."
															src={apiData.artists[3].images[0].url}
															className={navImageClasses}
														/>
														</Tooltip>

														<Tooltip
															id="tooltip-left"
															title={apiData.artists[4].name}
															placement="left"
															classes={{ tooltip: classes.tooltip }}
														>
														<img
															alt="..."
															src={apiData.artists[4].images[0].url}
															className={navImageClasses}
														/>
														</Tooltip>
													</GridItem>
												</GridContainer>
											)
										},
										{
											tabButton: "Albums",
											tabIcon: Favorite,
											tabContent: (
												<GridContainer justify="center">
													<GridItem xs={12} sm={12} md={4}>
														<Tooltip
															id="tooltip-left"
															title={apiData.albums[0].name}
															placement="left"
															classes={{ tooltip: classes.tooltip }}
														>
														<img
															alt="..."
															src={apiData.albums[0].images[0].url}
															className={navImageClasses}
														/>
														</Tooltip>

														<Tooltip
															id="tooltip-left"
															title={apiData.albums[5].name}
															placement="left"
															classes={{ tooltip: classes.tooltip }}
														>
														<img
															alt="..."
															src={apiData.albums[5].images[0].url}
															className={navImageClasses}
														/>
														</Tooltip>

														<Tooltip
															id="tooltip-left"
															title={apiData.albums[2].name}
															placement="left"
															classes={{ tooltip: classes.tooltip }}
														>
														<img
															alt="..."
															src={apiData.albums[2].images[0].url}
															className={navImageClasses}
														/>
														</Tooltip>
													</GridItem>
													<GridItem xs={12} sm={12} md={4}>
														<Tooltip
															id="tooltip-left"
															title={apiData.albums[3].name}
															placement="left"
															classes={{ tooltip: classes.tooltip }}
														>
														<img
															alt="..."
															src={apiData.albums[3].images[0].url}
															className={navImageClasses}
														/>
														</Tooltip>

														<Tooltip
															id="tooltip-left"
															title={apiData.albums[4].name}
															placement="left"
															classes={{ tooltip: classes.tooltip }}
														>
														<img
															alt="..."
															src={apiData.albums[4].images[0].url}
															className={navImageClasses}
														/>
														</Tooltip>
													</GridItem>
												</GridContainer>
											)
										}
									]}
								/>
							</GridItem>
						</GridContainer>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
