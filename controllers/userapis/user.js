const { mongoose, ObjectId } = require('mongoose');
const yogaworkoutUser = require('../../models/user');
const yogaworkoutSession = require('../../models/session');
const encryptDecrypt = require('../../utility/encryption'); // for encrypt and decrypt
const crypto = require('crypto');
const sendEmail = require('../../utility/email')
const generateOTP = require('../../utility/generateOTP');
const jwt = require('jsonwebtoken');

const checkUserAlreadyRegister = async (userName, mobileNo) => {
	const user = await yogaworkoutUser.find({
		username: userName,
		mobile: mobileNo,
	});
	if (user.length === 0) {
		return false;
	} else {
		return TransformStreamDefaultController;
	}
};

const checkUserBan = async (userName, is_Active) => {
	const user = await yogaworkoutUser.find({
		username: userName,
		isActive: is_Active,
	});
	if (user.length === 0) {
		return false;
	} else {
		return true;
	}
};

const getSession = async (userId, deviceId) => {
	try {
		// Generate a random string (similar to PHP's random string generation)
		const randstring = crypto.randomBytes(10).toString('hex');

		// Find the existing session for the user and device
		const existingSession = await yogaworkoutSession.findOne({
			user_Id: userId,
			deviceId: deviceId,
		});

		// If a session exists, delete it
		if (existingSession) {
			await yogaworkoutSession.deleteOne({
				user_Id: userId,
				deviceId: deviceId,
			});
		}

		// Create and save the new session
		const newSession = new yogaworkoutSession({
			user_Id: userId,
			session: randstring,
			deviceId: deviceId,
		});

		await newSession.save();

		// Return the generated session ID
		return randstring;
	} catch (err) {
		console.error('Error in getSession:', err);
		throw new Error('Could not create or retrieve session');
	}
};

const checkUserLogin = async (userId, session, deviceId) => {
	const existingSession = await yogaworkoutSession.findOne({
		user_Id: userId,
		session: session,
		deviceId: deviceId,
	});
	if (existingSession) {
		return true;
	} else {
		return false;
	}
};

const checkAlreadyRegister = async (req, res) => {
	try {
		const data = req.body;
		if (
			data.mobile &&
			data.mobile != '' &&
			data.username &&
			data.username != ''
		) {
			const mobile = data.mobile;
			const username = data.username;
			const checkalredyregister = await checkUserAlreadyRegister(
				username,
				mobile
			);
			if (checkalredyregister) {
				res.status(200).json({
					data: {
						success: 1,
						login: {
							userdetail: { '': '' },
							session: '',
							error: 'User already register',
						},
					},
				});
			} else {
				res.status(200).json({
					data: {
						success: 0,
						login: {
							userdetail: { '': '' },
							session: '',
							error: 'Please Try Again',
						},
					},
				});
			}
		} else {
			res.status(201).json({
				data: {
					success: 0,
					login: {
						userdetail: { '': '' },
						session: '',
						error: 'Variable Not Set',
					},
				},
			});
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({
			data: {
				success: 0,
				login: {
					userdetail: { '': '' },
					session: '',
					error: 'Server Error',
				},
			},
		});
	}
};

const userDetail = async (email) => {
	const user = await yogaworkoutUser.findOne({ email: email });
	if (user) {
		return user;
	} else {
		return false;
	}
};

const register = async (req, res) => {
	try {
		let userDetails = req.body;
		// console.log("userDetails", userDetails)
		if (
			userDetails.first_name &&
			userDetails.first_name != '' &&
			userDetails.last_name &&
			userDetails.last_name != '' &&
			userDetails.username &&
			userDetails.username != '' &&
			userDetails.email &&
			userDetails.email != '' &&
			userDetails.password &&
			userDetails.password != '' &&
			userDetails.mobile &&
			userDetails.mobile != '' &&
			userDetails.age &&
			userDetails.age != '' &&
			userDetails.gender &&
			userDetails.gender != '' &&
			userDetails.height &&
			userDetails.height != '' &&
			userDetails.weight &&
			userDetails.weight != '' &&
			userDetails.address &&
			userDetails.address != '' &&
			userDetails.city &&
			userDetails.city != '' &&
			userDetails.state &&
			userDetails.state != '' &&
			userDetails.country &&
			userDetails.country != '' &&
			userDetails.intensively &&
			userDetails.intensively != '' &&
			userDetails.timeinweek &&
			userDetails.timeinweek != '' &&
			userDetails.device_id &&
			userDetails.device_id != ''
		) {
			const checkUserRegister = await checkUserAlreadyRegister(
				userDetails.username,
				userDetails.mobile
			);
			// console.log("checkUserRegister", checkUserRegister)
			if (checkUserRegister) {
				res.status(201).json({
					success: 0,
					userdetail: [],
					error: 'User already register',
				});
			} else {
				const newUser = new yogaworkoutUser({
					first_name: userDetails.first_name,
					last_name: userDetails.last_name,
					username: userDetails.username,
					email: userDetails.email,
					password: encryptDecrypt.encrypt_decrypt(
						'encrypt',
						userDetails.password
					),
					mobile: userDetails.mobile,
					age: userDetails.age,
					gender: userDetails.gender,
					height: userDetails.height,
					weight: userDetails.weight,
					image: userDetails?.image,
					address: userDetails.address,
					city: userDetails.city,
					state: userDetails.state,
					country: userDetails.country,
					intensively: userDetails.intensively,
					timeinweek: userDetails.timeinweek,
				});

				const savedUser = await newUser.save();
				if (savedUser) {
					const newUserDetails = await userDetail(userDetails.email);
					// console.log("userDetails", userDetails)
					if (userDetails) {
						const session = await getSession(
							newUserDetails._id,
							userDetails.device_id
						);
						res.status(201).json({
							success: 1,
							login: {
								userdetail: newUserDetails,
								session: session,
								error: 'Register Successfully',
							},
						});
					} else {
						res.status(201).json({
							success: 1,
							login: {
								userdetail: newUserDetails,
								session: '',
								error: 'Please Try Again',
							},
						});
					}
				} else {
					res.status(201).json({
						success: 0,
						login: {
							userdetail: [],
							session: '',
							error: 'Please Try Again',
						},
					});
				}
			}
		} else {
			res.status(201).json({
				success: 0,
				login: {
					userdetail: [],
					session: '',
					error: 'Variable not set',
				},
			});
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({
			success: 0,
			login: {
				userdetail: [],
				session: '',
				error: 'Server Error',
			},
		});
	}
};

const login = async (req, res) => {
	try {
		const user = req.body;
		if (
			user.username &&
			user.username != '' &&
			user.password &&
			user.password != '' &&
			user.device_id &&
			user.device_id != ''
		) {
			const isBan = await checkUserBan(user.username, 1);

			if (isBan) {
				const Loginuser = await yogaworkoutUser
					.findOne({
						username: user.username,
						password: encryptDecrypt.encrypt_decrypt('encrypt', user.password),
					})
					.select('-password -php_password');

				if (!Loginuser) {
					res.status(400).json({
						data: {
							success: 0,
							login: {
								userdetail: { '': '' },
								session: '',
								error: 'Invalid username or password',
							},
						},
					});
				} else {
					const session = await getSession(Loginuser._id, user.device_id);
					res.status(200).json({
						data: {
							success: 1,
							login: {
								userdetail: Loginuser,
								session: session,
								error: '',
							},
						},
					});
				}
			} else {
				res.status(400).json({
					data: {
						success: 0,
						login: {
							userdetail: { '': '' },
							session: '',
							error: 'May be user is a not active',
						},
					},
				});
			}
		} else {
			res.status(400).json({
				data: {
					success: 0,
					login: {
						userdetail: { '': '' },
						session: '',
						error: 'Variable Not Set',
					},
				},
			});
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({
			data: {
				success: 0,
				login: {
					userdetail: { '': '' },
					session: '',
					error: 'Server Error',
				},
			},
		});
	}
};

const forgotPassword = async (req, res) => {
	try {
		const userbody = req.body;

		if (userbody.email && userbody.email !== '') {
			const user = await yogaworkoutUser.findOne({
				email: userbody.email,
			});
			if (user) {
				// Generate OTP
				const otp = generateOTP();
				const otpExpires = new Date(Date.now() + process.env.OTP_EXPIRE_MINUTES * 60 * 1000);

				// Save OTP to user
				user.otp = otp;
				user.otpExpires = otpExpires;
				await user.save({ validateBeforeSave: false });

				// Send email with OTP
				const message = `
				<h2>Password Reset OTP</h2>
				<p>Your OTP for password reset is: <strong>${otp}</strong></p>
				<p>This OTP is valid for ${process.env.OTP_EXPIRE_MINUTES} minutes.</p>
			  `;

				try {
					await sendEmail({
						email: user.email,
						subject: 'Password Reset OTP',
						message
					});

					res.status(200).json({
						success: true,
						message: `OTP sent to ${user.email}`
					});
				} catch (error) {
					console.log("error", error)
					// Reset OTP if email fails
					user.otp = undefined;
					user.otpExpires = undefined;
					await user.save({ validateBeforeSave: false });

					return res.status(500).json({
						success: false,
						message: 'Email could not be sent'
					});
				}
			} else {
				return res.json({
					data: { success: 0, forgotpassword: { error: 'Please try again' } },
				});
			}
		} else {
			return res.json({
				data: { success: 0, forgotpassword: { error: 'Variable not set' } },
			});
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({
			data: { success: 0, forgotpassword: { error: 'Server Error' } },
		});
	}
};

const verifyOTP = async (req, res) => {
	try {
		const { email, otp } = req.body;

		// Find user
		const user = await yogaworkoutUser.findOne({
			email,
			otpExpires: { $gt: Date.now() }
		});

		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'Invalid OTP or OTP has expired'
			});
		}

		// Check if OTP matches
		if (user.otp !== otp) {
			return res.status(400).json({
				success: false,
				message: 'Invalid OTP'
			});
		}

		// Generate reset token
		const resetToken = jwt.sign(
			{ id: user._id },
			process.env.JWT_SECRET,
			{ expiresIn: '10m' }
		);

		// Set reset token and expiry
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
		user.otp = undefined;
		user.otpExpires = undefined;
		await user.save({ validateBeforeSave: false });

		res.status(200).json({
			success: true,
			token: resetToken,
			message: 'OTP verified successfully'
		});

	} catch (e) {
		res.status(500).json({
			data: { success: 0, forgotpassword: { error: 'Server Error' } },
		});
	}
}

const changePassword = async (req, res) => {
	try {
		const userbody = req.body;

		if (
			userbody.email &&
			userbody.email !== '' &&
			userbody.newpassword &&
			userbody.newpassword !== '' &&
			userbody.resettoken &&
			userbody.resettoken != ''
		) {

			// Verify token
			const decoded = jwt.verify(userbody.resettoken, process.env.JWT_SECRET);

			// Find user
			const user = await yogaworkoutUser.findOne({
				_id: decoded.id,
				resetPasswordToken : userbody.resettoken,
				resetPasswordExpire: { $gt: Date.now() }
			});

			if (user) {
				// Hash the new password
				const hashedPassword = encryptDecrypt.encrypt_decrypt(
					'encrypt',
					userbody.newpassword
				);
				// Update the password in the database
				const result = await yogaworkoutUser.updateOne(
					{ _id: new mongoose.Types.ObjectId(user._id) },
					{ $set: { password: hashedPassword, resetPasswordToken : undefined,resetPasswordExpire: undefined } },
					{ new: true } // Return the updated document
				);

				if (result) {
					return res.json({
						data: {
							success: 1,
							updatepassword: { error: 'Password changed successfully' },
						},
					});
				} else {
					return res.json({
						data: { success: 0, updatepassword: { error: 'Please try again' } },
					});
				}
			} else {
				return res.json({
					data: { success: 0, updatepassword: { error: 'Please try again' } },
				});
			}
		} else {
			return res.json({
				data: { success: 0, updatepassword: { error: 'Variable not set' } },
			});
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({
			data: { success: 0, updatepassword: { error: 'Server Error' } },
		});
	}
};

const updatePassword = async (req, res) => {
	try {
		const userbody = req.body;

		// Validate input
		if (
			!(
				userbody.user_id &&
				userbody.user_id !== '' &&
				userbody.session &&
				userbody.session !== '' &&
				userbody.device_id &&
				userbody.device_id !== '' &&
				userbody.newpassword &&
				userbody.newpassword !== '' &&
				userbody.oldpassword &&
				userbody.oldpassword !== ''
			)
		) {
			return res.status(400).json({
				data: { success: 0, updatepassword: { error: 'Variable Not Set' } },
			});
		}

		const checkuserLogin = await checkUserLogin(
			userbody.user_id,
			userbody.session,
			userbody.device_id
		);
		if (checkuserLogin) {
			const Loginuser = await yogaworkoutUser.findOne({
				_id: new mongoose.Types.ObjectId(userbody.user_id),
				password: encryptDecrypt.encrypt_decrypt(
					'encrypt',
					userbody.oldpassword
				),
			});
			if (Loginuser) {
				// Hash the new password
				const hashedPassword = encryptDecrypt.encrypt_decrypt(
					'encrypt',
					userbody.newpassword
				);
				// Update the password in the database
				const result = await yogaworkoutUser.updateOne(
					{ _id: new mongoose.Types.ObjectId(Loginuser._id) },
					{ $set: { password: hashedPassword } },
					{ new: true } // Return the updated document
				);

				if (result) {
					return res.json({
						data: {
							success: 1,
							updatepassword: { error: 'Change password successfully' },
						},
					});
				} else {
					return res.json({
						data: { success: 0, updatepassword: { error: 'Please try again' } },
					});
				}
			} else {
				return res.status(400).json({
					data: { success: 0, updatepassword: { error: 'Old password wrong' } },
				});
			}
		} else {
			res.status(201).json({
				data: { success: 0, updatepassword: { error: 'Please login first' } },
			});
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({
			data: { success: 0, updatepassword: { error: 'Server Error' } },
		});
	}
};

module.exports = {
	register,
	login,
	checkUserLogin,
	checkAlreadyRegister,
	forgotPassword,
	changePassword,
	updatePassword,
	verifyOTP
};
